///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';

import Pedal, { nodeType as pedalNodeType } from './features/pedal';
import TubeAmp, { nodeType as tubeAmpNodeType } from './features/tubeAmp';
import Cabinet from './features/cabinet';
import Diagram from './features/diagram';
import PluginsTrayWidget from './features/pluginsTray';

declare var FaustModule: any;

enum InputModes {
  DI,
  MIC
}

export type PluginType = AudioNode | pedalNodeType | tubeAmpNodeType;

function disconnectPlugins(plugins: Array<Array<PluginType>>) {
  plugins.forEach((plugin) => {
    if (plugin) {
      plugin.forEach(node => node?.disconnect());
    }
  });
}

const availablePlugins = ['kpp_distruction.dsp', 'kpp_octaver.dsp', 'kpp_tubeamp.dsp', 'kpp_fuzz.dsp', 'kpp_bluedream.dsp',];

interface StateType {
  audioContext: AudioContext | null,
  lineInStreamSource: MediaStreamAudioSourceNode | null,
  diTrackStreamSource: MediaElementAudioSourceNode | null,
  inputMode: InputModes | null,
  cabConvolver: ConvolverNode | null,
  pluginsToRender: Array<string>,
  plugins: Array<Array<PluginType>>,
  pluginOrder: Array<number> | null,
  allPluginsTailNode: { node: PluginType; } | null,
  faustCompiler: Faust.Compiler | null,
  faustFactory: Faust.MonoFactory | null,
  faustCode: string,
}

const initialState: StateType = {
  audioContext: null,
  lineInStreamSource: null,
  diTrackStreamSource: null,
  inputMode: null,
  cabConvolver: null,
  pluginsToRender: [
    'kpp_distruction.dsp',
    // 'kpp_tubeamp.dsp',
    // 'kpp_octaver.dsp',
  ],
  plugins: [],
  pluginOrder: null,
  allPluginsTailNode: null,
  faustCompiler: null,
  faustFactory: null,
  faustCode: '',
};

function App() {
  const [state, setState] = useState<StateType>(initialState);

  const { audioContext, lineInStreamSource, diTrackStreamSource } = state;

  const diAudioRef = useRef(new Audio());

  function resumeAudioContext(audioContext: AudioContext) {
    if (audioContext.state === 'suspended' || audioContext.state !== 'running') {
      return audioContext.resume();
    }
    return Promise.resolve();
  }

  async function initGuitarInputFromLineIn() {
    const audioContext = state.audioContext || new AudioContext({ latencyHint: 'interactive', });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    });

    await resumeAudioContext(audioContext);

    const lineInStreamSource = audioContext.createMediaStreamSource(stream);
    setState((prevState) => ({
      ...prevState,
      audioContext,
      lineInStreamSource,
      diTrackStreamSource,
      inputMode: InputModes.MIC,
    }));
  }

  function onDiPlay() {
    if (diTrackStreamSource) {
      return;
    }

    const audioContext = state.audioContext || new AudioContext({ latencyHint: 'interactive', });
    const audioElement = diAudioRef.current;

    resumeAudioContext(audioContext).then(() => {
      const diTrackStreamSource = audioContext.createMediaElementSource(audioElement);
      setState((prevState) => ({
        ...prevState,
        audioContext,
        lineInStreamSource,
        diTrackStreamSource,
        inputMode: InputModes.DI
      }));
    });
  }

  useEffect(() => {
    FaustModule().then((module: any) => {
      let compiler = Faust.createCompiler(Faust.createLibFaust(module) as Faust.LibFaust);

      let factory = Faust.createMonoFactory();

      setState((prevState) => ({
        ...prevState,
        faustFactory: factory,
        faustCompiler: compiler,
      }));
    });
  }, []);

  let streamSource: typeof diTrackStreamSource | typeof lineInStreamSource;

  switch (state.inputMode) {
    case InputModes.DI: streamSource = diTrackStreamSource; break;
    case InputModes.MIC: streamSource = lineInStreamSource; break;
    default: streamSource = diTrackStreamSource || lineInStreamSource;
  }

  const onPluginReady = useCallback((nodes: (pedalNodeType | tubeAmpNodeType)[], index: number) => {
    setState(prevState => {
      const plugins = [...(prevState.plugins)];
      plugins[index] = nodes;
      return { ...prevState, plugins };
    });
  }, []);

  const onCabReady = useCallback((cabConvolver: ConvolverNode) => {
    setState(prevState => {
      if (prevState.cabConvolver && prevState.audioContext && prevState.allPluginsTailNode?.node) {
        prevState.allPluginsTailNode.node.disconnect(prevState.cabConvolver);
        prevState.cabConvolver.disconnect(prevState.audioContext.destination);
      }
      return { ...prevState, cabConvolver };
    });
  }, []);

  const getPluginElement = useCallback((pluginSrc: string, key: number): JSX.Element => {
    return pluginSrc === 'kpp_tubeamp.dsp'
      ? <TubeAmp key={key} index={key} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />
      : <Pedal key={key} index={key} sourceUrl={pluginSrc} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />;
  }, [state.faustFactory, state.faustCompiler, state.audioContext, onPluginReady]);

  const plugins = useMemo(() => state.pluginsToRender.map((pluginSrc, index) => getPluginElement(pluginSrc, index)),
    [getPluginElement, state.pluginsToRender]);

  // reconnects cab convolver on ir change
  useEffect(() => {
    if (state.cabConvolver && state.allPluginsTailNode && Object.keys(state.allPluginsTailNode as object).length && state.audioContext) {
      state.cabConvolver.disconnect();
      (state.allPluginsTailNode.node as AudioNode).connect(state.cabConvolver as ConvolverNode).connect(state.audioContext.destination);
    }
  }, [state.cabConvolver, state.allPluginsTailNode, state.audioContext]);

  // handles connecting faust plugins signal chain
  useEffect(() => {
    if (!streamSource || !audioContext || state.plugins.length !== plugins.length
      || state.plugins.filter(plugin => !!plugin).length !== plugins.length) {
      return;
    }

    disconnectPlugins(state.plugins);

    resumeAudioContext(audioContext).then(() => {
      const orderedPlugins = state.pluginOrder ? state.pluginOrder.map(pluginIndex => state.plugins[pluginIndex]) : state.plugins;

      const allPluginsTailNode = [...orderedPlugins].reverse().reduce((prevPlugin, currentPlugin, index) => {
        const pluginTailNode = currentPlugin.reduce((prevNode, currentNode, i) => {
          return i !== 0
            ? (prevNode as AudioNode).connect(currentNode as AudioNode)
            : currentNode as AudioNode;
        }, {});

        return index === 0 ? pluginTailNode : (pluginTailNode as AudioNode).connect(prevPlugin as AudioNode);
      }, {});

      const firstNode = orderedPlugins[0][0];
      (streamSource as AudioNode).connect(firstNode as AudioNode);

      setState(prevState => ({ ...prevState, allPluginsTailNode: { node: allPluginsTailNode as AudioNode, } }));
    });
  }, [state.plugins, plugins.length, state.pluginOrder, streamSource, audioContext]);

  const setPluginOrder = useCallback((pluginOrder: Array<number>) => {
    setState((prevState) => ({
      ...prevState,
      pluginOrder,
    }));
  }, []);

  const addPlugin = useCallback((plugin: string) => {
    setState((prevState) => {
      disconnectPlugins(prevState.plugins);

      return {
        ...prevState,
        pluginsToRender: [...prevState.pluginsToRender, plugin],
        pluginOrder: prevState.pluginOrder
          ? [...prevState.pluginOrder, prevState.plugins.length]
          : [...prevState.plugins.map((_, index) => index), prevState.plugins.length],
      };
    })
  }, []);

  return (
    <div className="App">
      <div>
        Click <button disabled={!!lineInStreamSource} onClick={initGuitarInputFromLineIn}>here</button> to turn on your guitar input.
      </div>
      <div className="plugins-wrapper">
        <PluginsTrayWidget plugins={availablePlugins} />
        <Diagram plugins={plugins} pluginOrder={state.pluginOrder} setPluginOrder={setPluginOrder} addPlugin={addPlugin} />
      </div>
      <Cabinet audioContext={state.audioContext} onCabReady={onCabReady} />
      <div>
        <audio controls ref={diAudioRef} onPlay={onDiPlay}>
          <source src={`${process.env.PUBLIC_URL}/di/LasseMagoDI.mp3`} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}

export default App;

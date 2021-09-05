///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

import Pedal, { nodeType as pedalNodeType } from './features/pedal';
import TubeAmp, { nodeType as tubeAmpNodeType } from './features/tubeAmp';
import Cabinet from './features/cabinet';
import Diagram from './features/diagram';
import PluginsTrayWidget from './features/pluginsTray';
import { Profile } from './features/tubeAmp/profile';
import Details from './features/details';
import InputDeviceSelect from './features/inputDeviceSelect';

declare var FaustModule: any;

enum InputModes {
  DI,
  MIC
}

export type PluginType = AudioNode | pedalNodeType | tubeAmpNodeType;
type PluginsType = Record<string, {
  source: string;
  nodes: Array<PluginType>;
  order: number;
  profile?: Profile;
}>;

function disconnectPlugins(plugins: PluginsType) {
  const pluginNodes = Object.entries(plugins).map(entry => entry[1].nodes);

  pluginNodes.forEach((plugin) => {
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
  inputDeviceID: string,
  inputMode: InputModes | null,
  cabConvolver: ConvolverNode | null,
  pluginsHistory: Array<string>, // filled when new plugins are loaded by source url, doesn't get reduced for caching reasons
  plugins: PluginsType, // all currently loaded plugins
  pluginsOrder: Array<number> | null, // plugin indices from pluginsHistory
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
  inputDeviceID: 'default',
  cabConvolver: null,
  pluginsHistory: [
    // 'kpp_distruction.dsp',
    'kpp_tubeamp.dsp',
    // 'kpp_octaver.dsp',
  ],
  plugins: {},
  pluginsOrder: null,
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

  const initGuitarInputFromLineIn = useCallback(async function (deviceID?: string) {
    const audioContext = state.audioContext || new AudioContext({ latencyHint: 'interactive', });

    const devID = deviceID ?? state.inputDeviceID;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: devID,
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      } as MediaTrackConstraints
    });

    await resumeAudioContext(audioContext);

    const lineInStreamSource = audioContext.createMediaStreamSource(stream);
    setState((prevState) => {
      if (prevState.lineInStreamSource) {
        prevState.lineInStreamSource.disconnect();
      }

      return {
        ...prevState,
        audioContext,
        lineInStreamSource,
        diTrackStreamSource,
        inputDeviceID: devID,
        inputMode: InputModes.MIC,
      }
    });
  }, [state.audioContext, diTrackStreamSource, state.inputDeviceID]);

  function onDiPlay() {
    if (diTrackStreamSource) {
      return;
    }

    const audioContext = state.audioContext || new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });
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

  const onPluginReady = useCallback((nodes: (pedalNodeType | tubeAmpNodeType)[], source: string, id: string, profile?: Profile) => {
    setState(prevState => {
      let order: number;
      const pluginEntries = Object.entries(prevState.plugins);

      const samePlugin = pluginEntries.find(entry => entry[0] === id);

      if (!samePlugin) {
        const lastPluginOccurance = (pluginEntries
          .filter(entry => entry[1].source === source)
          ?.map(entry => entry[1].order)
          .sort((a, b) => b - a) || [undefined])[0];

        order = prevState.pluginsHistory.indexOf(source, typeof lastPluginOccurance === 'number' ? lastPluginOccurance + 1 : undefined);
        order = order === -1 ? prevState.pluginsHistory.length : order;
      } else {
        order = samePlugin[1].order;
      }

      return {
        ...prevState,
        pluginsOrder: prevState.pluginsOrder || [0],
        plugins: {
          ...prevState.plugins,
          [id]: {
            order,
            nodes,
            source,
            profile,
          }
        }
      };
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

  const deviceIDChangeHandler = useCallback((deviceID: string) => {
    if (state.inputMode === InputModes.MIC) {
      initGuitarInputFromLineIn(deviceID);
    }
  }, [initGuitarInputFromLineIn, state.inputMode]);

  const getPluginElement = useCallback((pluginSrc: string, id: string, pluginNodes?: Array<PluginType>, pluginProfile?: Profile): JSX.Element => {
    return pluginSrc === 'kpp_tubeamp.dsp'
      ? <TubeAmp id={id} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} pluginNodes={pluginNodes as tubeAmpNodeType[]} pluginProfile={pluginProfile} />
      : <Pedal id={id} sourceUrl={pluginSrc} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} pluginNodes={pluginNodes as pedalNodeType[]} />;
  }, [state.faustFactory, state.faustCompiler, state.audioContext, onPluginReady]);

  const renderingPluginIdsRef = useRef<Array<string>>([]);
  const plugins = useMemo(() => state.pluginsHistory.map((pluginSrc, index) => {
    let pluginId: string;
    if (!renderingPluginIdsRef.current[index]) {
      pluginId = uuidv4();
      renderingPluginIdsRef.current[index] = pluginId;
    } else {
      pluginId = renderingPluginIdsRef.current[index];
    }

    const pluginEntries = Object.entries(state.plugins);
    const possiblePluginEntry = pluginEntries.filter(entry => entry[0] === pluginId)[0];
    const nodes = possiblePluginEntry ? possiblePluginEntry[1].nodes : undefined;
    const pluginProfile = possiblePluginEntry ? possiblePluginEntry[1].profile : undefined;

    return getPluginElement(pluginSrc, pluginId, nodes, pluginProfile);
  }), [getPluginElement, state.pluginsHistory, state.plugins, renderingPluginIdsRef]);

  // reconnects cab convolver on ir change
  useEffect(() => {
    if (state.cabConvolver && state.allPluginsTailNode && Object.keys(state.allPluginsTailNode as object).length && state.audioContext) {
      state.cabConvolver.disconnect();
      (state.allPluginsTailNode.node as AudioNode).connect(state.cabConvolver as ConvolverNode).connect(state.audioContext.destination);
    }
  }, [state.cabConvolver, state.allPluginsTailNode, state.audioContext]);

  // handles connecting faust plugins signal chain
  useEffect(() => {
    if (!streamSource || !audioContext || Object.keys(state.plugins).length !== plugins.length
      || Object.entries(state.plugins).filter(entry => !!entry[1]).length !== plugins.length) {
      return;
    }

    disconnectPlugins(state.plugins);

    resumeAudioContext(audioContext).then(() => {
      const pluginEntries = Object.entries(state.plugins);

      const orderedPlugins = state.pluginsOrder
        ? state.pluginsOrder.map(order => pluginEntries.filter(entry => entry[1].order === order)[0][1].nodes)
        : pluginEntries.map(entry => entry[1].nodes);
      const isAnyPluginLoading = !!orderedPlugins.filter(plugin => !plugin).length;

      if (isAnyPluginLoading) {
        return;
      }

      const allPluginsTailNode = [...orderedPlugins as Array<PluginType[]>].reverse().reduce((prevPlugin, currentPlugin, index) => {
        const pluginTailNode = currentPlugin.reduce((prevNode, currentNode, i) => {
          return i !== 0
            ? (prevNode as AudioNode).connect(currentNode as AudioNode)
            : currentNode as AudioNode;
        }, {});

        return index === 0 ? pluginTailNode : (pluginTailNode as AudioNode).connect(prevPlugin as AudioNode);
      }, {});

      const firstNode = (orderedPlugins as Array<PluginType[]>)[0][0];
      (streamSource as AudioNode).connect(firstNode as AudioNode);

      setState(prevState => ({ ...prevState, allPluginsTailNode: { node: allPluginsTailNode as AudioNode, } }));
    });
  }, [state.plugins, plugins.length, state.pluginsOrder, streamSource, audioContext]);

  const setPluginsOrder = useCallback((pluginsOrder: Array<number>) => {
    setState((prevState) => ({
      ...prevState,
      pluginsOrder,
    }));
  }, []);

  const addPlugin = useCallback((source: string) => {
    setState((prevState) => {
      disconnectPlugins(prevState.plugins);
      const pluginEntries = Object.entries(prevState.plugins);

      // if all loaded plugins of a given source are already in a signal chain
      const shouldLoadNewPlugin = !prevState.pluginsOrder || prevState.pluginsHistory.filter((src, index) => src === source && prevState.pluginsOrder?.includes(index)).length
        === pluginEntries.filter(entry => entry[1].source === source).length;

      const newPluginsOrder = prevState.pluginsOrder
        ? [...prevState.pluginsOrder, shouldLoadNewPlugin
          ? pluginEntries.length
          : (pluginEntries.find(entry => entry[1].source === source && !prevState.pluginsOrder?.includes(entry[1].order)) as any)[1].order]
        : [...pluginEntries.map((_, index) => index), pluginEntries.length]

      return {
        ...prevState,
        pluginsHistory: !shouldLoadNewPlugin
          ? prevState.pluginsHistory
          : [...prevState.pluginsHistory, source],
        pluginsOrder: newPluginsOrder,
      };
    })
  }, []);

  return (
    <div className="App">
      <div className="non-canvas">
        <div className="details-wrapper">
          <Details />
        </div>
        <div className="device-select-wrapper">
          <InputDeviceSelect onChange={deviceIDChangeHandler} />
        </div>
        <div>
          Click <button disabled={!!lineInStreamSource} onClick={() => initGuitarInputFromLineIn()}>here</button> to turn on your guitar input.
        </div>
        <Cabinet audioContext={state.audioContext} onCabReady={onCabReady} />
        <div>
          <audio controls ref={diAudioRef} onPlay={onDiPlay}>
            <source src={`${process.env.PUBLIC_URL}/di/LasseMagoDI.mp3`} type="audio/mpeg" />
          </audio>
        </div>
        {!!Object.entries(state.plugins).length && <PluginsTrayWidget plugins={availablePlugins} />}
      </div>
      <div className="plugins-diagram">
        <Diagram plugins={plugins} pluginsOrder={state.pluginsOrder} setPluginsOrder={setPluginsOrder} addPlugin={addPlugin} />
      </div>
    </div>
  );
}

export default App;

///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';

import Pedal, { nodeType as pedalNodeType } from './features/pedal';
import TubeAmp, { nodeType as tubeAmpNodeType } from './features/tubeAmp';
import Cabinet from './features/cabinet';

declare var FaustModule: any;

enum InputModes {
  DI,
  MIC
}

interface StateType {
  audioContext: AudioContext | null,
  lineInStreamSource: MediaStreamAudioSourceNode | null,
  diTrackStreamSource: MediaElementAudioSourceNode | null,
  inputMode: InputModes | null,
  cabConvolver: ConvolverNode | null,
  plugins: Array<Array<pedalNodeType | tubeAmpNodeType>>,
  allPluginsTailNode: AudioNode | pedalNodeType | tubeAmpNodeType | null,
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
  plugins: [],
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
    // IRs in kpp_tubeamp *.tapf files are 48000 Hz
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
      if (prevState.cabConvolver && prevState.audioContext && prevState.allPluginsTailNode) {
        prevState.allPluginsTailNode.disconnect(prevState.cabConvolver);
        prevState.cabConvolver.disconnect(prevState.audioContext.destination);
      }
      return { ...prevState, cabConvolver };
    });
  }, []);

  const plugins = useMemo(() => [
    <Pedal key={0} index={0} sourceUrl={'kpp_distruction.dsp'} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />,
    <TubeAmp key={1} index={1} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />
  ], [state.faustFactory, state.faustCompiler, state.audioContext, onPluginReady]);

  useEffect(() => {
    if (state.cabConvolver && state.allPluginsTailNode && Object.keys(state.allPluginsTailNode as object).length && state.audioContext) {
      (state.allPluginsTailNode as AudioNode).connect(state.cabConvolver as ConvolverNode).connect(state.audioContext.destination);
    }
  }, [state.cabConvolver, state.allPluginsTailNode, state.audioContext]);

  useEffect(() => {
    if (!streamSource || !audioContext || state.plugins.length !== plugins.length
      || state.plugins.filter(plugin => !!plugin).length !== plugins.length) {
      return;
    }

    resumeAudioContext(audioContext).then(() => {
      const allPluginsTailNode = [...state.plugins].reverse().reduce((prevPlugin, currentPlugin, index) => {
        const pluginTailNode = currentPlugin.reduce((prevNode, currentNode, i) => {
          return i !== 0
            ? (prevNode as AudioNode).connect(currentNode as AudioNode)
            : currentNode as AudioNode;
        }, {});

        return index === 0 ? pluginTailNode : (pluginTailNode as AudioNode).connect(prevPlugin as AudioNode);
      }, {});

      const firstNode = state.plugins[0][0];
      (streamSource as AudioNode).connect(firstNode as AudioNode);

      setState(prevState => ({ ...prevState, allPluginsTailNode: allPluginsTailNode as AudioNode }));
    });
  }, [state.plugins, plugins.length, streamSource, audioContext]);

  return (
    <div className="App">
      <div>
        Click <button disabled={!!lineInStreamSource} onClick={initGuitarInputFromLineIn}>here</button> to turn on your guitar input.
      </div>
      <div className="plugins-wrapper">
        {plugins}
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

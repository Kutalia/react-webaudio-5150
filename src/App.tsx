///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import Pedal, { nodeType as pedalNodeType } from './features/pedal';
import TubeAmp, { nodeType as tubeAmpNodeType } from './features/tubeAmp';

declare var FaustModule: any;

interface StateType {
  audioContext: AudioContext | null,
  lineInStreamSource: MediaStreamAudioSourceNode | null,
  diTrackStreamSource: MediaElementAudioSourceNode | null,
  cabConvolver: ConvolverNode | null,
  plugins: Array<Array<pedalNodeType | tubeAmpNodeType>>,
  faustCompiler: Faust.Compiler | null,
  faustFactory: Faust.MonoFactory | null,
  faustCode: string,
}

const initialState: StateType = {
  audioContext: null,
  lineInStreamSource: null,
  diTrackStreamSource: null,
  cabConvolver: null,
  plugins: [],
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
    const lineInAudioContext = new AudioContext();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    });

    await resumeAudioContext(lineInAudioContext);

    const lineInStreamSource = lineInAudioContext.createMediaStreamSource(stream);
    setState((prevState) => ({
      ...prevState,
      audioContext: lineInAudioContext,
      lineInStreamSource,
      diTrackStreamSource: null,
    }));
  }

  function onDiPlay() {
    if (diTrackStreamSource) {
      return;
    }

    const audioContext = new AudioContext();
    const audioElement = diAudioRef.current;

    resumeAudioContext(audioContext).then(() => {
      const diTrackStreamSource = audioContext.createMediaElementSource(audioElement);
      setState((prevState) => ({
        ...prevState,
        audioContext,
        lineInStreamSource: null,
        diTrackStreamSource,
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

  useEffect(() => {
    if (!state.cabConvolver && audioContext) {
      fetch('/ir/1on-preshigh.wav')
        .then(response => response.arrayBuffer())
        .then(buffer => {
          audioContext.decodeAudioData(buffer, decoded => {
            const cabConvolver = new ConvolverNode(audioContext);
            cabConvolver.buffer = decoded;

            setState(prevState => ({ ...prevState, cabConvolver }));
          });
        })
    }
  }, [state.cabConvolver, audioContext]);

  const streamSource = lineInStreamSource || diTrackStreamSource;

  const onPluginReady = useCallback((nodes: (pedalNodeType | tubeAmpNodeType)[], index: number) => {
    setState(prevState => {
      const plugins = [...(prevState.plugins)];
      plugins[index] = nodes;
      return { ...prevState, plugins };
    });
  }, []);

  useEffect(() => {
    if (!streamSource || !audioContext || !state.plugins.length || !state.cabConvolver) {
      return;
    }

    resumeAudioContext(audioContext).then(() => {
      const allPluginsTailNode = state.plugins.reverse().reduce((prevPlugin, currentPlugin, index) => {
        const pluginTailNode = currentPlugin.reduce((prevNode, currentNode, i) => {
          return i === 0
            ? (index === 0
              ? (prevNode as AudioNode).connect(currentNode as AudioNode)
              : currentNode as AudioNode)
            : (prevNode as AudioNode)?.connect(currentNode as AudioNode);
        }, index === 0 ? streamSource : {});

        return index === 0 ? pluginTailNode : (pluginTailNode as AudioNode).connect(prevPlugin as AudioNode);
      }, {});

      (allPluginsTailNode as AudioNode).connect(state.cabConvolver as ConvolverNode).connect(audioContext.destination);
    });
  }, [state.plugins, streamSource, audioContext, state.cabConvolver]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Click <button disabled={!!lineInStreamSource} onClick={initGuitarInputFromLineIn}>here</button> to turn on your guitar input.
          <Pedal index={0} sourceUrl={'kpp_distruction.dsp'} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />
          <TubeAmp index={1} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onPluginReady={onPluginReady} />
          <audio controls ref={diAudioRef} onPlay={onDiPlay}>
            <source src="di/LasseMagoDI.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </header>
    </div>
  );
}

export default App;

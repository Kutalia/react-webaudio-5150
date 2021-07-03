///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef } from 'react';
import './App.css';

import Pedal, { nodeType } from './features/pedal';
import TubeAmp from './features/tubeAmp';

declare var FaustModule: any;

interface StateType {
  audioContext: AudioContext | null,
  lineInStreamSource: MediaStreamAudioSourceNode | null,
  diTrackStreamSource: MediaElementAudioSourceNode | null,
  faustCompiler: Faust.Compiler | null,
  faustFactory: Faust.MonoFactory | null,
  faustCode: string,
  faustNode: Faust.FaustMonoNode | null,
}

const initialState = {
  audioContext: null,
  lineInStreamSource: null,
  diTrackStreamSource: null,
  faustCompiler: null,
  faustFactory: null,
  faustCode: '',
  faustNode: null,
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

  const onNodeReady = (node: nodeType) => {
    const streamSource = lineInStreamSource || diTrackStreamSource;

    if (!streamSource || !audioContext || !node) {
      return;
    }

    resumeAudioContext(audioContext).then(() => {
      const convolver = new ConvolverNode(audioContext);

      fetch('/ir/1on-preshigh.wav')
        .then(response => response.arrayBuffer())
        .then(buffer => {
          audioContext.decodeAudioData(buffer, decoded => {
            convolver.buffer = decoded;

            streamSource.connect(node as AudioNode).connect(convolver).connect(audioContext.destination);
          }).catch((err) => console.error(err));
        });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Click <button disabled={!!lineInStreamSource} onClick={initGuitarInputFromLineIn}>here</button> to turn on your guitar input.
          {/* <Pedal sourceUrl={'kpp_distruction.dsp'} compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onNodeReady={onNodeReady} /> */}
          <TubeAmp compiler={state.faustCompiler} factory={state.faustFactory} context={state.audioContext} onNodeReady={onNodeReady} />
          <audio controls ref={diAudioRef} onPlay={onDiPlay}>
            <source src="di/LasseMagoDI.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </header>
    </div>
  );
}

export default App;

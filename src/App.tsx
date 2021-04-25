import { ChangeEvent, useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const defaultGain = 5;

interface StateType {
  audioContext: AudioContext | null,
  gainNode: GainNode | null,
  lineInStreamSource: MediaStreamAudioSourceNode | null,
  diTrackStreamSource: MediaElementAudioSourceNode | null,
  gain: number | null,
}

const initialState = {
  audioContext: null,
  gainNode: null,
  lineInStreamSource: null,
  diTrackStreamSource: null,
  gain: null,
};

function App() {
  const [state, setState] = useState<StateType>(initialState);

  const { audioContext, gain, lineInStreamSource, diTrackStreamSource } = state;

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

  function changeVolume(event: ChangeEvent<HTMLInputElement>) {
    const { gainNode } = state;

    if (!audioContext || !gainNode) {
      event.preventDefault();
      return;
    }

    const parsed = parseFloat(event.target.value);
    const value = Number.isNaN(parsed) ? 1 : parsed;

    gainNode.gain.setTargetAtTime(value, audioContext.currentTime, 0.01);
    setState((prevState) => ({
      ...prevState,
      gain: value,
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
    if (!audioContext) {
      return;
    }

    const streamSource = lineInStreamSource || diTrackStreamSource;

    if (!streamSource) {
      return;
    }

    let gainNode: GainNode;

    if (state.gainNode) {
      gainNode = state.gainNode;
    } else {
      gainNode = new GainNode(audioContext, { gain: defaultGain });
      setState((prevState) => ({
        ...prevState,
        gainNode,
      }));
      return;
    }

    resumeAudioContext(audioContext).then(() => {
      const convolver = new ConvolverNode(audioContext);

      fetch('/ir/2off-pres5.wav')
        .then(response => response.arrayBuffer())
        .then(buffer => {
          audioContext.decodeAudioData(buffer, decoded => {
            convolver.buffer = decoded;
            streamSource.connect(convolver).connect(gainNode).connect(audioContext.destination);
          });
        }).catch((err) => console.error(err));
    });
  }, [lineInStreamSource, diTrackStreamSource, audioContext, state.gainNode]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Click <button disabled={!!lineInStreamSource} onClick={initGuitarInputFromLineIn}>here</button> to turn on your guitar input.
          <input type="range" min="0" max="1" step="0.01" value={String(gain)} onChange={changeVolume} />
          <audio controls ref={diAudioRef} onPlay={onDiPlay}>
            <source src="di/LasseMagoDI.mp3" type="audio/mpeg" />
          </audio>
        </p>
      </header>
    </div>
  );
}

export default App;

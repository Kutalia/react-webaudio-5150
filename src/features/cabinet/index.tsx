import { useState, useEffect, ChangeEvent } from 'react';
import './Cabinet.css';

const positions = ['center', 'cone', 'edge'];
const irs = ['1on-preshigh', '1on-pres8', '1on-pres5'];

const cabConvolverFromArrayBuffer = (audioContext: AudioContext, buffer: ArrayBuffer, cb?: (cab: ConvolverNode) => any) => {
  const cabConvolver = new ConvolverNode(audioContext);
  audioContext?.decodeAudioData(buffer, decoded => {
    cabConvolver.buffer = decoded;
    cb && cb(cabConvolver);
  });
};

type PropTypes = {
  audioContext: AudioContext | null,
  onCabReady: (cab: ConvolverNode) => void,
};

const Cabinet = ({ audioContext, onCabReady }: PropTypes) => {
  const [position, setPosition] = useState<number>(0);

  const changePosition = () => {
    setPosition((prevPosition) => {
      return prevPosition === positions.length - 1 ? 0 : prevPosition + 1;
    })
  };

  const onIRInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (audioContext && event.target.files?.length) {
      event.target.files[0].arrayBuffer().then(buffer => cabConvolverFromArrayBuffer(audioContext, buffer, onCabReady));
    }
  }

  useEffect(() => {
    if (audioContext) {
      fetch(`${process.env.PUBLIC_URL}/ir/${irs[position]}.wav`)
        .then(response => response.arrayBuffer())
        .then(buffer => cabConvolverFromArrayBuffer(audioContext, buffer, onCabReady));
    }
  }, [position, audioContext, onCabReady]);

  return (
    <>
      <div className="cabinet" onClick={changePosition}>
        <img className="speaker" alt="Guitar Speaker" src={`${process.env.PUBLIC_URL}/speaker.png`} />
        <img className={`mic mic--${positions[position]}`} alt="Microphone" src={`${process.env.PUBLIC_URL}/shure_sm57.png`} />
      </div>
      <div className="ir-input">
        <label htmlFor="ir">Choose your IR</label>
        <input type="file" id="ir" accept="audio/*" onChange={onIRInput} />
      </div>
    </>
  );
};

export default Cabinet;

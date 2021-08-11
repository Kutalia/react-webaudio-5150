import { useState, useEffect } from 'react';
import './Cabinet.css';

const positions = ['center', 'cone', 'edge'];
const irs = ['1on-preshigh', '1on-pres8', '1on-pres5'];

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

    useEffect(() => {
        if (audioContext) {
          fetch(`${process.env.PUBLIC_URL}/ir/${irs[position]}.wav`)
            .then(response => response.arrayBuffer())
            .then(buffer => {
              audioContext.decodeAudioData(buffer, decoded => {
                const cabConvolver = new ConvolverNode(audioContext);
                cabConvolver.buffer = decoded;
    
                onCabReady(cabConvolver);
              });
            })
        }
      }, [position, audioContext, onCabReady]);

    return (
        <div className="cabinet" onClick={changePosition}>
            <img className="speaker" alt="Guitar Speaker" src={`${process.env.PUBLIC_URL}/speaker.png`} />
            <img className={`mic mic--${positions[position]}`} alt="Microphone" src={`${process.env.PUBLIC_URL}/shure_sm57.png`} />
        </div>
    );
};

export default Cabinet;

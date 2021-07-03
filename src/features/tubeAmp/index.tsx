///<reference types="@grame/libfaust" />
import { profile } from 'console';
import { ChangeEvent, useState, useEffect } from 'react'

import { ProfileHeader, ProfileHeaderSize } from './profile';

export type nodeType = Faust.FaustMonoNode | null;

type propTypes = {
  context: AudioContext | null,
  factory: Faust.MonoFactory | null,
  compiler: Faust.Compiler | null,
  onNodeReady: (node: nodeType) => void,
};

type descriptorType = {
  address: string,
  index: number,
  init: number,
  label: string,
  max: number,
  min: number,
  step: number,
  type: string,
};

type controlsType = Record<string, string>;

const tubeAmpAddr = '/kpp_tubeamp/kpp_tubeamp.dsp';

const TubeAmp = ({ context, factory, compiler, onNodeReady }: propTypes) => {
  const [node, setNode] = useState<nodeType>();
  const [controls, setControls] = useState<controlsType>({});

  useEffect(() => {
    if (factory && context && compiler) {
      fetch(tubeAmpAddr).then(resp => resp.text()).then(text => {
        factory.compileNode(context, 'Faust', compiler, text, '-ftz 2', false, 128).then(node => {
          console.log(node);
          setNode(node);
          onNodeReady(node);
        });
      });
    }
  }, [context, factory, compiler, onNodeReady]);

  useEffect(() => {
    fetch('/tubeAmp_Profiles/v1.0/Modern Metal.tapf')
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const profileHeaderBuffer = buffer.slice(0, ProfileHeaderSize);

        // 4 chars 1 byte each
        const signature = new Uint8Array(profileHeaderBuffer.slice(0, 4));
        const testStr = 'TaPf';
        // simulating C++ strncmp function for checking profile signature
        for (let i = 0; i < testStr.length; i++) {
            if (testStr.charCodeAt(i) !== signature[i]) return;
        }

        const profileVersion = new Uint32Array(profileHeaderBuffer.slice(4, 8))[0];
        
        const profileHeaderArr = new Float32Array(profileHeaderBuffer);

        let profileHeader: ProfileHeader;
        
        // profileHeaderArr.reduce<object>((prevVal, currentVal, index) => {
                           
        // }, {})
    });
  });

  if (!node) return null;

  const sliderParams = (node as any).fDescriptor.filter(({ type }: descriptorType) => type === 'vslider');

  const handleChangeControl = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.id;
    const value = e.target.value;

    node.setParamValue(address, Number.parseFloat(value));
  };

  return (
    <>
      {sliderParams.map(({ address, init, label, min, max, step }: descriptorType) => (
        <div key={address}>
          <label htmlFor={address}>{label}</label>
          <input id={address} type="range" min={min} max={max} step={step} defaultValue={init} onChange={handleChangeControl} />
        </div>
      ))}
    </>
  )
};

export default TubeAmp;

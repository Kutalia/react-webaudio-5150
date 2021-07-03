///<reference types="@grame/libfaust" />
import { ChangeEvent, useState, useEffect } from 'react'

export type nodeType = Faust.FaustMonoNode | null;

type propTypes = {
  sourceUrl: string,
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

const Pedal = ({ sourceUrl, context, factory, compiler, onNodeReady }: propTypes) => {
  const [node, setNode] = useState<nodeType>();
  const [controls, setControls] = useState<controlsType>({});

  useEffect(() => {
    if (factory && context && compiler) {
      fetch(sourceUrl).then(resp => resp.text()).then(text => {
        factory.compileNode(context, 'Faust', compiler, text, '-ftz 2', false, 128).then(node => {
          console.log(node);
          setNode(node);
          onNodeReady(node);
        });
      });
    }
  }, [sourceUrl, context, factory, compiler, onNodeReady]);

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

export default Pedal;

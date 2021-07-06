///<reference types="@grame/libfaust" />
import { ChangeEvent, useState, useEffect, useRef } from 'react'

export type nodeType = Faust.FaustMonoNode | null;

type propTypes = {
  index: number,
  sourceUrl: string,
  context: AudioContext | null,
  factory: Faust.MonoFactory | null,
  compiler: Faust.Compiler | null,
  onPluginReady: (node: nodeType[], index: number) => void,
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

const Pedal = ({ index, sourceUrl, context, factory, compiler, onPluginReady }: propTypes) => {
  const [node, setNode] = useState<nodeType>();
  const [controls, setControls] = useState<controlsType>({});

  const fetchRef = useRef(false);

  useEffect(() => {
    if (factory && context && compiler && !node && !fetchRef.current) {
      fetch(sourceUrl).then(resp => resp.text()).then(text => {
        fetchRef.current = true;
        factory.compileNode(context, 'Pedal' + index, compiler, text, '-ftz 2', false, 128).then(node => {
          setNode(node);
          onPluginReady([node], index);
        });
      });
    }
  }, [sourceUrl, context, factory, compiler, onPluginReady, index, node, fetchRef]);

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

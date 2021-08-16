///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef } from 'react';
import { Knob, Pointer, Arc, Value } from 'rc-knob';

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

const Pedal = ({ index, sourceUrl, context, factory, compiler, onPluginReady }: propTypes) => {
  const [node, setNode] = useState<nodeType>();

  const fetchRef = useRef(false);

  useEffect(() => {
    if (factory && context && compiler && !node && !fetchRef.current) {
      fetch(process.env.PUBLIC_URL + '/' + sourceUrl).then(resp => resp.text()).then(text => {
        fetchRef.current = true;
        factory.compileNode(context, 'Pedal' + index, compiler, text, '-ftz 2', false, 128).then(node => {
          setNode(node);
          onPluginReady([node], index);
        });
      });
    }
  }, [sourceUrl, context, factory, compiler, onPluginReady, index, node, fetchRef]);

  if (!node) {
    return <div>Start audio to load the plugin</div>;
}

  const sliderParams = (node as any).fDescriptor.filter(({ type }: descriptorType) => type === 'vslider' || type === 'hslider');

  const handleChangeControl = (address: string, val: number) => {
    node.setParamValue(address, val);
  };

  return (
    <div className="plugin pedal">
      <div className="plugin-title">{(node as any)?.fJSONDsp?.name}</div>
      <div className="knobs-wrapper">
        {sliderParams.map(({ address, init, label, min, max, step }: descriptorType) => (
          <div key={address} className="knob">
            <label htmlFor={address}>{label.toUpperCase()}</label>
            <Knob
              size={50}
              angleOffset={220}
              angleRange={280}
              min={min}
              max={max}
              value={init || 0.01}
              onChange={(val: number) => handleChangeControl(address, val)}
            >
              <Arc
                arcWidth={2.5}
                color="#FC5A96"
                radius={18.75}
              />
              <Pointer
                width={2.5}
                radius={20}
                type="circle"
                color="#180094"
              />
              <Value
                marginBottom={20}
                className="value"
              />
            </Knob>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Pedal;

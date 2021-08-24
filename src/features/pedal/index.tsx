///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef } from 'react';
import { Knob, Pointer, Arc, Value } from 'rc-knob';

import { stopEventPropagation } from '../../helpers/utils';

export type nodeType = Faust.FaustMonoNode | null;

type propTypes = {
  id: string,
  sourceUrl: string,
  context: AudioContext | null,
  factory: Faust.MonoFactory | null,
  compiler: Faust.Compiler | null,
  onPluginReady: (nodes: nodeType[], source: string, id: string) => void,
  pluginNodes?: nodeType[],
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

const Pedal = ({ id, sourceUrl, context, factory, compiler, onPluginReady, pluginNodes, }: propTypes) => {
  const [node, setNode] = useState<nodeType>(pluginNodes ? pluginNodes[0] : null);

  const fetchRef = useRef(false);

  useEffect(() => {
    if (factory && context && compiler && !node && !fetchRef.current) {
      fetch(process.env.PUBLIC_URL + '/' + sourceUrl).then(resp => resp.text()).then(text => {
        fetchRef.current = true;
        factory.compileNode(context, 'Pedal_' + id, compiler, text, '-ftz 2', false, 128).then(node => {
          setNode(node);
          onPluginReady([node], sourceUrl, id);
        });
      });
    }
  }, [sourceUrl, context, factory, compiler, onPluginReady, id, node, fetchRef]);

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
      <div className="knobs-wrapper" onMouseDown={stopEventPropagation}>
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

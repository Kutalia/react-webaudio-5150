///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef } from 'react';
import { Knob, Pointer, Arc } from 'rc-knob';
import SpeexResampler from 'speex-resampler';

import { Profile, ProfileProps, profileSize, impulseSize } from './profile';
import { stopEventPropagation } from '../../helpers/utils';

export type nodeType = Faust.FaustMonoNode | AudioNode;

type propTypes = {
    id: string,
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

const tubeAmpAddr = 'kpp_tubeamp.dsp';

const getControlsByType = (node: any, ctrlType: string): descriptorType[] => node ? (node).fDescriptor.filter(({ type }: descriptorType) => type === ctrlType) : [];

const TubeAmp = ({ id, context, factory, compiler, onPluginReady, pluginNodes }: propTypes) => {
    const [node, setNode] = useState<Faust.FaustMonoNode | null>((pluginNodes ? pluginNodes[1] : null) as (Faust.FaustMonoNode | null));
    const [profile, setProfile] = useState<Profile>();
    const [resamplerReady, setResamplerReady] = useState<boolean>(false);
    const fetchRef = useRef(false);

    useEffect(() => {
        if (!node && factory && context && compiler && !fetchRef.current) {
            fetchRef.current = true;
            fetch(process.env.PUBLIC_URL + '/' + tubeAmpAddr).then(resp => resp.text()).then(text => {
                factory.compileNode(context, 'kpp_tubeamp_' + id, compiler, text, '-ftz 2', false, 128).then(faustNode => {
                    if (faustNode) setNode(faustNode);
                });
            });
        }
    }, [context, factory, compiler, node, fetchRef, id]);

    useEffect(() => {
        SpeexResampler.initPromise.then(() => {
            setResamplerReady(true);
        });
    }, [])

    useEffect(() => {
        if (context && node && !profile && resamplerReady) {
            fetch(`${process.env.PUBLIC_URL}/tubeAmp_Profiles/v1.0/Modern Metal.tapf`)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    // simulating C++ fread
                    let bufferPosition = 0;
                    const profileBuffer = buffer.slice(0, profileSize);
                    bufferPosition = profileSize;

                    // 4 chars 1 byte each
                    const signature = new Uint8Array(profileBuffer.slice(0, 4));
                    const testStr = 'TaPf';
                    // simulating C++ strncmp function for checking profile signature
                    for (let i = 0; i < testStr.length; i++) {
                        if (testStr.charCodeAt(i) !== signature[i]) return;
                    }

                    const profileVersion = new Uint32Array(profileBuffer.slice(4, 8))[0];

                    const profileArr = new Float32Array(profileBuffer);

                    let profile: Profile;

                    profile = profileArr.reduce<object>((prevVal, currentVal, index) =>
                        Object.assign(prevVal, { [ProfileProps[index]]: currentVal })
                        , {}) as Profile;

                    profile.signature = testStr;
                    profile.version = profileVersion;

                    setProfile(profile);

                    const impulseHeader = buffer.slice(bufferPosition, bufferPosition + impulseSize);
                    bufferPosition += impulseSize;

                    const impulseHeaderArr = new Int32Array(impulseHeader);
                    const impulseSampleRate = impulseHeaderArr[0];
                    const impulseSampleCount = impulseHeaderArr[2];
                    const impulseSamplesSize = impulseSampleCount * 4;

                    const impulseBuffer = buffer.slice(bufferPosition, bufferPosition + impulseSamplesSize);
                    bufferPosition += impulseSamplesSize;

                    if (impulseBuffer.byteLength !== impulseSamplesSize) {
                        return;
                    }

                    const preampConvolver = new ConvolverNode(context);

                    const resampler = new SpeexResampler(1, impulseSampleRate, context.sampleRate, 10);
                    const bufferArr = new Int16Array(impulseBuffer);
                    const res = resampler.processChunk(bufferArr as any);
                    const resampledArr = new Float32Array(res);

                    const audioBuffer = context.createBuffer(1, res.byteLength / 2, context.sampleRate);
                    const audioData = audioBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i++) {
                        audioData[i] = resampledArr[i];
                    }

                    preampConvolver.buffer = audioBuffer;

                    onPluginReady([preampConvolver, node], tubeAmpAddr, id);
                });
        }
    }, [context, node, profile, onPluginReady, id, resamplerReady]);

    useEffect(() => {
        const nentryParams = getControlsByType(node, 'nentry');

        if (profile) {
            nentryParams.forEach((descriptor) => {
                node?.setParamValue(descriptor.address, profile[descriptor.label as keyof typeof ProfileProps] as number)
            });
        }
    }, [node, profile])

    if (!node) {
        return <div>Start audio to load the plugin</div>;
    }

    const sliderParams = getControlsByType(node, 'vslider');

    const handleChangeControl = (address: string, val: number) => {
        node.setParamValue(address, val);
    };

    return (
        <div className="plugin amp-head">
            <div className="plugin-title">{(node as any)?.fJSONDsp?.name}</div>
            <div className="knobs-wrapper" onMouseDown={stopEventPropagation}>
                {sliderParams.map(({ address, init, label, min, max, step }: descriptorType) => (
                    <div key={address} className="knob">
                        <label htmlFor={address}>{label}</label>
                        <Knob
                            size={50}
                            angleOffset={220}
                            angleRange={280}
                            min={min}
                            max={max}
                            className="styledKnob"
                            value={init || 0.01} // because it renders incorrectly if 0
                            onChange={(val: number) => handleChangeControl(address, val)}
                        >
                            <Arc
                                arcWidth={0.75}
                            />
                            <circle r="20" cx="25" cy="25" />
                            <Pointer
                                width={1}
                                height={17.5}
                                radius={5}
                                type="rect"
                                color="#fff"
                            />
                        </Knob>

                    </div>
                ))}
            </div>
        </div>
    )
};

export default TubeAmp;

///<reference types="@grame/libfaust" />
import { ChangeEvent, useState, useEffect, useRef } from 'react'

import { Profile, ProfileProps, profileSize, Impulse, impulseSize } from './profile';

export type nodeType = Faust.FaustMonoNode | AudioNode;

type propTypes = {
    index: number, // relative index with other plugins
    context: AudioContext | null,
    factory: Faust.MonoFactory | null,
    compiler: Faust.Compiler | null,
    onPluginReady: (nodes: nodeType[], index: number) => void,
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

const tubeAmpAddr = '/kpp_tubeamp.dsp';

const getControlsByType = (node: any, ctrlType: string): descriptorType[] => node? (node).fDescriptor.filter(({ type }: descriptorType) => type === ctrlType) : [];

const TubeAmp = ({ index, context, factory, compiler, onPluginReady }: propTypes) => {
    const [node, setNode] = useState<Faust.FaustMonoNode>();
    const [controls, setControls] = useState<controlsType>({});
    const [profile, setProfile] = useState<Profile>();
    const fetchRef = useRef(false);

    useEffect(() => {
        if (!node && factory && context && compiler && !fetchRef.current) {
            fetchRef.current = true;
            fetch(tubeAmpAddr).then(resp => resp.text()).then(text => {
                factory.compileNode(context, 'kpp_tubeamp', compiler, text, '-ftz 2', false, 128).then(faustNode => {
                    if (faustNode) setNode(faustNode);
                });
            });
        }
    }, [context, factory, compiler, node, fetchRef]);

    useEffect(() => {
        if (context && node && !profile) {
            fetch('/tubeAmp_Profiles/v1.0/Modern Metal.tapf')
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
                    const sampleRate = impulseHeaderArr[0];
                    const impulseSampleCount = impulseHeaderArr[2];
                    const impulseSamplesSize = impulseSampleCount * 4;
    
                    const impulseBuffer = buffer.slice(bufferPosition, bufferPosition + impulseSamplesSize);
                    bufferPosition += impulseSamplesSize;
                    
                    if (impulseBuffer.byteLength !== impulseSamplesSize) {
                        return;
                    }
                    
                    const preampConvolver = new ConvolverNode(context);
                    const audioBuffer = context.createBuffer(1, impulseSampleCount, sampleRate);

                    const audioData = audioBuffer.getChannelData(0);
                    const impulseBufferArr = new Float32Array(impulseBuffer);

                    for (let i = 0; i< audioBuffer.length; i++) {
                        audioData[i] = impulseBufferArr[i];
                    }
                    
                    preampConvolver.buffer = audioBuffer;

                    onPluginReady([preampConvolver, node], index);
                });
        }
    }, [context, node, profile, onPluginReady, index]);

    useEffect(() => {
        const nentryParams = getControlsByType(node, 'nentry');
        
        if (profile) {
            nentryParams.forEach((descriptor) => {
                node?.setParamValue(descriptor.address, profile[descriptor.label as keyof typeof ProfileProps] as number)
            });
        }
    }, [node, profile])

    if (!node) return null;

    const sliderParams = getControlsByType(node, 'vslider');

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

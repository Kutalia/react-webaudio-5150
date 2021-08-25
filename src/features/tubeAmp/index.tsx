///<reference types="@grame/libfaust" />
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Knob, Pointer, Arc } from 'rc-knob';
import { resample } from 'wave-resampler';

import { Profile, ProfileProps, profileSize, impulseSize } from './profile';
import { stopEventPropagation } from '../../helpers/utils';

export type nodeType = Faust.FaustMonoNode | AudioNode;

type propTypes = {
    id: string,
    context: AudioContext | null,
    factory: Faust.MonoFactory | null,
    compiler: Faust.Compiler | null,
    onPluginReady: (nodes: nodeType[], source: string, id: string, profile: Profile) => void,
    pluginNodes?: nodeType[],
    pluginProfile?: Profile
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
const availableProfiles = [
    'v1.0/American Clean', 'v1.0/American Vintage', 'v1.0/British Crunch', 'v1.0/Modern Metal',
    'v1.2/Classic Hard', 'v1.2/JCM800 (spice)', 'v1.2/MarkII', 'v1.2/TwinReverb (spice)',
];
const defaultProfile = availableProfiles[0];

const getControlsByType = (node: any, ctrlType: string): descriptorType[] => node ? (node).fDescriptor.filter(({ type }: descriptorType) => type === ctrlType) : [];

const TubeAmp = ({ id, context, factory, compiler, onPluginReady, pluginNodes, pluginProfile }: propTypes) => {
    const [node, setNode] = useState<Faust.FaustMonoNode | null>((pluginNodes ? pluginNodes[1] : null) as (Faust.FaustMonoNode | null));
    const [profileSource, setProfileSource] = useState<string>(pluginProfile?.source || defaultProfile);
    const [profile, setProfile] = useState<Profile | undefined>(pluginProfile);
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
        if (context && node && ((!pluginNodes && !profile) || (profileSource !== (profile?.source || defaultProfile)))) {
            const src = profileSource;
            fetch(`${process.env.PUBLIC_URL}/tubeAmp_Profiles/${src}.tapf`)
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
                        Object.assign(prevVal, { [ProfileProps[index + 1]]: currentVal }) // + 1 because source property is not from tapf
                        , {}) as Profile;

                    profile.source = src;
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

                    const bufferArr = new Float32Array(impulseBuffer);

                    const resampledArr = new Float32Array(resample(bufferArr, impulseSampleRate, context.sampleRate));

                    const audioBuffer = context.createBuffer(1, resampledArr.length, context.sampleRate);
                    const audioData = audioBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i++) {
                        audioData[i] = resampledArr[i];
                    }

                    preampConvolver.buffer = audioBuffer;

                    onPluginReady([preampConvolver, node], tubeAmpAddr, id, profile);
                });
        }
    }, [context, node, profile, onPluginReady, id, pluginNodes, profileSource]);

    useEffect(() => {
        const nentryParams = getControlsByType(node, 'nentry');

        if (profile) {
            nentryParams.forEach((descriptor) => {
                node?.setParamValue(descriptor.address, profile[descriptor.label as keyof typeof ProfileProps] as number);
            });
        }
    }, [node, profile]);

    const onProfileChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setProfileSource(e.target.value);
    };

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
            <label htmlFor="profile">Choose Profile</label>
            <select id="profile" onChange={(e) => onProfileChange(e)} value={profileSource}>
                {availableProfiles.map((source) => <option key={source} value={source}>{source}</option>)}
            </select>
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

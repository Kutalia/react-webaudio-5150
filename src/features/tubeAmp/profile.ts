// Structure with tubeAmp model
// parameters.

export enum ProfileProps {
    source, signature, version, preamp_level, preamp_bias, preamp_Kreg, preamp_Upor,
    tonestack_low_freq, tonestack_low_band, tonestack_middle_freq, tonestack_middle_band, tonestack_high_freq, tonestack_high_band,
    amp_level, amp_bias, amp_Kreg, amp_Upor, sag_time, sag_coeff, output_level,
}

export type ProfilePropTypes = [string, string, ...number[]];

export type ProfilePropsUnion = keyof typeof ProfileProps;

export type Profile = {
    [k in ProfilePropsUnion]: ProfilePropTypes[typeof ProfileProps[k]]
}

// export interface Profile
// {
//     signature: string; // 4 chars, 4 bytes in total
    
//     version: number; // uint32
    
//     preamp_level: number; // 4 byte float
//     preamp_bias: number; // 4 byte float
//     preamp_Kreg: number; // 4 byte float
//     preamp_Upor: number; // 4 byte float
    
//     tonestack_low_freq: number; // 4 byte float
//     tonestack_low_band: number; // 4 byte float
//     tonestack_middle_freq: number; // 4 byte float
//     tonestack_middle_band: number; // 4 byte float
//     tonestack_high_freq: number; // 4 byte float
//     tonestack_high_band: number; // 4 byte float
    
//     amp_level: number; // 4 byte float
//     amp_bias: number; // 4 byte float
//     amp_Kreg: number; // 4 byte float
//     amp_Upor: number; // 4 byte float
    
//     sag_time: number; // 4 byte float
//     sag_coeff: number; // 4 byte float
    
//     output_level: number; // 4 byte float
// }

export const profileSize = 76; // 19 * 4, size in bytes

// structure of
// impulse response data
// in *.tapf profile file

export interface Impulse {
    sample_rate: number; // 4 byte int
    channel: number; // 4 byte int
    sample_count: number; // 4 byte int
}

export const impulseSize = 12;

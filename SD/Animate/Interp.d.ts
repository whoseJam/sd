interface Attributable {
    setAttribute: (key: string, value: any) => void;
}

export class Interp {
    static exLengthInterp(attrs: Attributable, key: string): (t: number) => void;
    static numberInterp(attrs: Attributable, key: string): (t: number) => void;
    static pixelInterp(attrs: Attributable, key: string): (t: number) => void;
    static colorInterp(attrs: Attributable, key: string): (t: number) => void;
    static stringInterp(attrs: Attributable, key: string): (t: number) => void;
    static arrayInterp(attrs: Attributable, key: string): (t: number) => void;
    static matrixInterp(attrs: Attributable, key: string): (t: number) => void;
    static translateInterp(attrs: Attributable, key: string): (t: number) => void;
    static boxInterp(attrs: Attributable, key: string): (t: number) => void;
}

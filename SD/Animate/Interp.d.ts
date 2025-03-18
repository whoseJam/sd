
export class Interp {
    static exLengthInterp(attrs: any, key: string): (t: number) => void;
    static numberInterp(attrs: any, key: string): (t: number) => void;
    static pixelInterp(attrs: any, key: string): (t: number) => void;
    static colorInterp(attrs: any, key: string): (t: number) => void;
    static stringInterp(attrs: any, key: string): (t: number) => void;
    static arrayInterp(attrs: any, key: string): (t: number) => void;
    static matrixInterp(attrs: any, key: string): (t: number) => void;
    static translateInterp(attrs: any, key: string): (t: number) => void;
    static boxInterp(attrs: any, key: string): (t: number) => void;
    static pathInterp(attrs: SVGPathElement, key: string): (t: number) => void;
}

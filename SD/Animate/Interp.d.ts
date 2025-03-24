export class Interp {
    static exLengthInterp(object: any, key: string): (t: number) => void;
    static numberInterp(object: any, key: string): (t: number) => void;
    static pixelInterp(object: any, key: string): (t: number) => void;
    static colorInterp(object: any, key: string): (t: number) => void;
    static stringInterp(object: any, key: string): (t: number) => void;
    static arrayInterp(object: any, key: string): (t: number) => void;
    static matrixInterp(object: any, key: string): (t: number) => void;
    static translateInterp(object: any, key: string): (t: number) => void;
    static boxInterp(object: any, key: string): (t: number) => void;
    static pathInterp(object: SVGPathElement, key: string): (t: number) => void;
}

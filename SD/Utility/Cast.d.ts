import { SDNode } from "@/Node/SDNode";

export class Cast {
    static castToSDNode(target: SDNode, any: any, id?: number): SDNode;
    static castHexToRGB(hex: string): { r: number; g: number; b: number };
    static castToArray(any: any): Array;
    static castToViewBox(object: any): { x: number; y: number; width: number; height: number };
    static castPointsToBox(points: Array<[number, number]>): { x: number; y: number; width: number; height: number };
}

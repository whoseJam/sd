import { SDNode } from "@/Node/SDNode";

export class Cast {
    static castToSDNode(parent: SDNode, any: any): SDNode;
    static castToSDNode(parent: SDNode, any: any, id: number): SDNode;
    static castD3ToNake(d3: any): Element;
    static castHexToRGB(hex: string): { r: number, g: number, b: number };
    static castToArray(any: any): Array;
    static castToNumber(any: any): number;
    static castToViewBox(object: any): { x: number, y: number, width: number, height: number };
}
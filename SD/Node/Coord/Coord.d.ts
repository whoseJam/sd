import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { Line } from "@/Node/SVG/Line";
import { Path } from "@/Node/SVG/Path";
import { RenderNode } from "@/Renderer/RenderNode";

export class SDFunction {
    function(func: (x: number) => number): this;
    coordX(y: number): number;
    coordY(x: number): number;
    trimCoordX(y: number): number;
    trimCoordY(y: number): number;
    globalX(y: number): number;
    globalY(x: number): number;
    trimGlobalX(y: number): number;
    trimGlobalY(x: number): number;
}

export class Coord extends SD2DNode {
    constructor(target: SDNode | RenderNode);
    xAxis(): SDNode;
    yAxis(): SDNode;
    viewX(): number;
    viewX(x: number): this;
    viewY(): number;
    viewY(y: number): this;
    viewWidth(): number;
    viewWidth(width: number): this;
    viewHeight(): number;
    viewHeight(height: number): this;
    viewBox(): { x: number; y: number; width: number; height: number };
    viewBox(x: number, y: number, width: number, height: number): this;
    viewBox(viewBox: { x: number; y: number; width: number; height: number }): this;
    coordX(x: number): number;
    coordY(y: number): number;
    coordAt(x: number, y: number): [number, number];
    coordAt(v: [number, number]): [number, number];
    globalX(x: number): number;
    globalY(y: number): number;
    globalAt(x: number, y: number): [number, number];
    globalAt(v: [number, number]): [number, number];
    trim(source: [number, number], target: [number, number]): [[number, number], [number, number], boolean];
    trim(source: [number, number], k: number): [[number, number], [number, number], boolean];
    draw(func: (x: number) => number): Path & SDFunction;
    draw(name: number | string, func: (x: number) => number): Path & SDFunction;
    drawLine(name: number | string, k: number, point: [number, number]): Line & SDFunction;
    drawLine(name: number | string, k: number, x: number, y: number): Line & SDFunction;
}

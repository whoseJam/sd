import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { SD2DNode } from "@/Node/SD2DNode";

export class BaseCoord extends SD2DNode {
    axis(by: "x" | "y"): BaseAxis;
    ticks(by: "x" | "y"): any;
    ticks(by: "x" | "y", ticks: any): this;
    local(x: number, y: number): [number, number];
    local(v: [number, number]): [number, number];
    localX(x: number): number;
    localX(x: number, y: number): number;
    localX(v: [number, number]): number;
    localY(y: number): number;
    localY(x: number, y: number): number;
    localY(v: [number, number]): number;
    global(x: number, y: number): [number, number];
    global(v: [number, number]): [number, number];
    globalX(x: number): number;
    globalX(x: number, y: number): number;
    globalX(v: [number, number]): number;
    globalY(y: number): number;
    globalY(x: number, y: number): number;
    globalY(v: number): number;
    globalK(x: number, y: number): number;
    globalK(v: [number, number]): number;
}

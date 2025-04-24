import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";

export class BaseAxis extends SD2DNode {
    ticks(): number;
    ticks(ticks: any): this;
    tick(x: number): SDNode | undefined;
    percent(x: number): number;
    local(x: number, y: number): number;
    local(v: [number, number]): number;
    global(x: number): [number, number];
    globalX(x: number): number;
    globalY(x: number): number;

    forEachTick(callback: (tick: SDNode, i: number) => void): this;
    tickCount(): number;
}

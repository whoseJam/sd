import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";

type Location = "l" | "r" | "b" | "t";

export class BracePlugin extends BraceCurve {
    brace(target1: number | SDNode, target2: number | SDNode, location?: Location, gap?: number): this;
    brace(target1: number | SDNode, target2: number | SDNode, location?: Location, gap?: number): this;
    location(): Location;
    location(location: Location): this;
    braceGap(): number;
    braceGap(gap: number): this;
    valueGap(): number;
    valueGap(gap: number): this;
    value(value: SDNode): this;
}

export function Brace(target: SD2DNode | RenderNode): BracePlugin;

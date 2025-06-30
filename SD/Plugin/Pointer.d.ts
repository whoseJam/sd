import { Line } from "@/Node/Path/LineSVG";
import { SDNode } from "@/Node/SDNode";

export class CompPointer {
    moveTo(): this;
    moveTo(index: number): this;
    moveTo(i: number, j: number): this;
    moveTo(element: SDNode): this;
    pointAt(): SDNode | undefined;
}

export function Pointer(parent: SDNode, label: string, direction: "b" | "t" | "l" | "r", gap: number, length: number): CompPointer & Line;

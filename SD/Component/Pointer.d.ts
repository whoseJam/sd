import { SDNode } from "@/Node/SDNode";
import { Line } from "@/Node/SVG/Line";

class CompPointer {
    moveTo(): this;
    moveTo(index: number): this;
    moveTo(i: number, j: number): this;
    moveTo(element: SDNode): this;
}

export function Pointer(parent: SDNode, label: string, direction: "b" | "t" | "l" | "r", gap: number, length: number): CompPointer & Line;

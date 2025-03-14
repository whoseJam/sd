import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SDNode } from "@/Node/SDNode";

type Location = "l" | "r" | "b" | "t";

class CompBrace {
    brace(element1: number | SDNode, element2: number | SDNode, location: Location | undefined, gap: number | undefined): this;
    location(): Location;
    location(location: Location): this;
    braceGap(): number;
    braceGap(gap: number): this;
    valueGap(): number;
    valueGap(gap: number): this;
    value(value: SDNode): this;
}

export function Brace(parent: SDNode): CompBrace & BraceCurve;

import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";

type Location = "t" | "b" | "l" | "r";

export class ZZLine extends BaseCurve {
    constructor(parent: SDNode);
    bending(): number;
    bending(bending: number): this;
    location(): Location;
    location(location: Location): this;
}
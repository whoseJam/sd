import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

type Location = "t" | "b" | "l" | "r";

export class CompIndex {
    location(): Location;
    location(location: Location): this;
    fontSize(): number;
    fontSize(fontSize: number): this;
    gap(): number;
    gap(gap: number): this;
}

export function Index(parent: SDNode, location: Location, fontSize: number, gap: number): CompIndex & BaseArray;

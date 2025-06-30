import { SDNode } from "@/Node/SDNode";
import { Mathjax } from "@/Node/Text/Mathjax";
import { Text } from "@/Node/Text/TextSVG";

type Location = "lt" | "lc" | "lb" | "tl" | "tc" | "tr" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

export class CompLabel {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

export function Label(parent: SDNode, text: string, location: Location, fontSize: number, gap: number): CompLabel & Text;
export function MathjaxLabel(parent: SDNode, text: string, location: Location, fontSize: number, gap: number): CompLabel & Mathjax;

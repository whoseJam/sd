import { SDNode } from "@/Node/SDNode";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

class CompAside {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

export function Aside<T>(parent: SDNode, aside: T, location: Location, gap: number): CompAside & T;

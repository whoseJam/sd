import { Coord } from "@/Node/Coord/Coord";

export class FixGapCoord extends Coord {
    gap(by: "x" | "y"): number;
    gap(by: "x" | "y", gap: number): this;
}

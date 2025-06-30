import { SDColor } from "@/Utility/Color";

export class MathAtom {
    fill(): string;
    fill(fill: SDColor | string): this;
    stroke(): string;
    stroke(stroke: SDColor | string): this;
    color(): SDColor;
    color(color: SDColor | string): this;
}

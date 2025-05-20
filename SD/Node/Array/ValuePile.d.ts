import { Pile } from "@/Node/Array/Pile";

type Align = "x" | "cx" | "mx";

export class ValuePile extends Pile {
    align(): Align;
    align(align: Align): this;
}

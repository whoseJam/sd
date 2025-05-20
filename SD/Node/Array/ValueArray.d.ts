import { Array } from "@/Node/Array/Array";

type Align = "y" | "cy" | "my";

export class ValueArray extends Array {
    align(): Align;
    align(align: Align): this;
}

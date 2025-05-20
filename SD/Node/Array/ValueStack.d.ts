import { Stack } from "@/Node/Array/Stack";

type Align = "x" | "cx" | "mx";

export class ValueStack extends Stack {
    align(): Align;
    align(align: Align): this;
}

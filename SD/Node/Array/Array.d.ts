import { BaseArray } from "@/Node/Array/BaseArray";

export class Array extends BaseArray {
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}

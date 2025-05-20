import { BaseShape } from "@/Node/Shape/BaseShape";

export class Ellipse extends BaseShape {
    rx(): number;
    rx(rx: number): this;
    ry(): number;
    ry(ry: number): this;
}

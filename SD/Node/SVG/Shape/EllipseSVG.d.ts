import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";

export class EllipseSVG extends BaseShapeSVG {
    rx(): number;
    rx(rx: number): this;
    ry(): number;
    ry(ry: number): this;
}

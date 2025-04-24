import { SDNode } from "@/Node/SDNode";
import { Path } from "@/Node/SVG/Path";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseCurve extends Path {
    x1(): number;
    x1(x: number): this;
    x2(): number;
    x2(x: number): this;
    y1(): number;
    y1(y: number): this;
    y2(): number;
    y2(y: number): this;
    source(): [number, number];
    source(vector: [number, number]): this;
    source(x: number, y: number): this;
    target(): [number, number];
    target(vector: [number, number]): this;
    target(x: number, y: number): this;
}

import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

export class SD2DNode extends SDNode {
    constructor(target: SDNode | RenderNode);

    opacity(): number;
    opacity(opacity: number): this;

    inRange(point: [number, number]): boolean;
    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    scale(scale: number): this;
    pos(xLocator: XLocator, yLocator: YLocator, dx?: number, dy?: number): [number, number];
    center(): [number, number];
    center(center: [number, number]): this;
    center(cx: number, cy: number): this;
    kx(k: number): number;
    ky(k: number): number;
    dx(dx: number): this;
    dy(dy: number): this;
    cx(): number;
    cx(cx: number): this;
    cy(): number;
    cy(cy: number): this;
    mx(): number;
    mx(mx: number): this;
    my(): number;
    my(my: number): this;
}

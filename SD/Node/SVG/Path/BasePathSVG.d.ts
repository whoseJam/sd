import { BaseSVG } from "@/Node/SVG/BaseSVG";

export class BasePathSVG extends BaseSVG {
    constructor(target: SDNode | RenderNode, label: string);
    markerStart(): string;
    markerStart(marker: string): this;
    markerMid(): string;
    markerMid(marker: string): this;
    markerEnd(): string;
    markerEnd(marker: string): this;
    arrow(arrow?: boolean | undefined | null): this;
    revArrow(arrow?: boolean | undefined | null): this;
    doubleArrow(arrow?: boolean | undefined | null): this;
    pointStoT(): this;
    pointTtoS(): this;
    fadeStoT(): this;
    fadeTtoS(): this;
    at(k: number): [number, number];
    getPointAtLength(length: number): [number, number];
    totalLength(): number;
    text(): string;
    text(text: string): this;
    intValue(): number;
    value(): SDNode | undefined;
    value(value: any, rule?: SDRule): this;
    valueFromExist(value: SDNode, rule?: SDRule): this;
    drop(): SDNode;
}

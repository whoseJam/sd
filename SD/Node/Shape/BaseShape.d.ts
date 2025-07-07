import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";
import { Polygon } from "@flatten-js/core";

export class BaseShape extends SD2DNode {
    toPolygon(): Polygon;
    fill(): string;
    fill(fill: string): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): string;
    stroke(stroke: string): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    color(): SDColor;
    color(color: string | SDColor): this;
}

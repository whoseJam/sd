import { SD2DNode } from "@/Node/SD2DNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";
import { Polygon as PolygonLogic } from "@flatten-js/core";

export class BaseShape extends SD2DNode {
    toPolygon(): PolygonLogic;
    fill(): HexColor;
    fill(fill: SDColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    color(): PacketColor;
    color(color: SDColor): this;
}

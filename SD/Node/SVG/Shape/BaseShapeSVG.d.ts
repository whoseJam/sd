import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Polygon } from "@flatten-js/core";

export class BaseShapeSVG extends BaseSVG {
    toPolygon(): Polygon;
}

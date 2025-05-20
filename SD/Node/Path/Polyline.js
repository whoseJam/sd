import { Polygon } from "@/Node/Shape/Polygon";

export function Polyline(target, points = []) {
    const PolylineSVG = require("@/Node/SVG/Path/PolylineSVG");
    return new PolylineSVG(target, points);
}

Polyline.prototype = {
    x: Polygon.prototype.x,
    y: Polygon.prototype.y,
    width: Polygon.prototype.width,
    height: Polygon.prototype.height,
    points: Polygon.prototype.points,
    __points: Polygon.prototype.__points,
};

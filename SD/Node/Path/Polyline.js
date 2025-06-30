import { Polygon } from "@/Node/Shape/Polygon";

export class Polyline {
    constructor(target, points = []) {
        const PolylineSVG = require("@/Node/Path/PolylineSVG");
        return new PolylineSVG(target, points);
    }
}

Object.assign(Polyline.prototype, {
    x: Polygon.prototype.x,
    y: Polygon.prototype.y,
    width: Polygon.prototype.width,
    height: Polygon.prototype.height,
    points: Polygon.prototype.points,
    __points: Polygon.prototype.__points,
});

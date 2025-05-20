import { Interp } from "@/Animate/Interp";
import { Polygon } from "@/Node/Shape/Polygon";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Factory } from "@/Utility/Factory";

export function PolygonSVG(target, points = []) {
    BaseShapeSVG.call(this, target, "polygon");

    this.type("PolygonSVG");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        points,
    });

    this.vars.associate("points", Factory.action(this, this._.nake, "points", Interp.pointsInterp));

    this._.nake.setAttribute("points", this.vars.points);
}

PolygonSVG.prototype = {
    ...BaseShapeSVG.prototype,
    ...Polygon.prototype,
};

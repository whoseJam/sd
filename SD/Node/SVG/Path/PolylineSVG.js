import { Interp } from "@/Animate/Interp";
import { Polyline } from "@/Node/Path/Polyline";
import { BasePathSVG } from "@/Node/SVG/Path/BasePathSVG";
import { Factory } from "@/Utility/Factory";

export function PolylineSVG(target, points = []) {
    BasePathSVG.call(this, target, "polyline");

    this.type("PolylineSVG");

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

PolylineSVG.prototype = {
    ...BasePathSVG.prototype,
    ...Polyline.prototype,
};

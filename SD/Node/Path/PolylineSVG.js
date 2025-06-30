import { Interp } from "@/Animate/Interp";
import { BasePath } from "@/Node/Path/BasePath";
import { BaseSVG } from "@/Node/Path/BaseSVG";
import { Polyline } from "@/Node/Path/Polyline";
import { Factory } from "@/Utility/Factory";

export class PolylineSVG extends BasePath {
    constructor(target, points = []) {
        super(target);

        BaseSVG.call(this, "polyline");

        this.type("PolylineSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            points,
        });

        this._.nake.setAttribute("points", this.vars.points);

        this.vars.watch("points", Factory.action(this, this._.nake, "points", Interp.pointsInterp));
    }
}

PolylineSVG.extend(Polyline);

Object.assign(PolylineSVG.prototype, {
    ...Polyline.prototype,
    ...BaseSVG.prototype,
});

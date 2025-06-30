import { Interp } from "@/Animate/Interp";
import { svg } from "@/Interact/Root";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { BaseSVG } from "@/Node/Shape/BaseSVG";
import { Polygon } from "@/Node/Shape/Polygon";
import { Factory } from "@/Utility/Factory";

let globalPolygon = undefined;

function createPolygon() {
    if (globalPolygon === undefined) {
        globalPolygon = svg().append("polygon");
        globalPolygon.setAttribute("fill-opacity", 0);
        globalPolygon.setAttribute("stroke-opacity", 0);
    }
}

function polygonToBox(points) {
    createPolygon();
    globalPolygon.setAttribute("points", points);
    return globalPolygon.nake().getBBox();
}

export class PolygonSVG extends BaseShape {
    constructor(target, points = []) {
        super(target);

        BaseSVG.call(this, "polygon");

        this.type("PolygonSVG");

        if (points.length >= 1) {
            const box = polygonToBox(points);
            this.vars.merge(box);
        } else {
            this.vars.merge({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            });
        }

        this.vars.merge({
            points,
        });

        this.vars.watch("points", Factory.action(this, this._.nake, "points", Interp.pointsInterp));

        this._.nake.setAttribute("points", this.vars.points);
    }
}

PolygonSVG.extend(Polygon);

Object.assign(PolygonSVG.prototype, {
    ...Polygon.prototype,
    ...BaseSVG.prototype,
});

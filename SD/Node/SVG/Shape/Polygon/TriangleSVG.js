import { PolygonSVG } from "@/Node/SVG/Shape/PolygonSVG";

export function TriangleSVG(target) {
    PolygonSVG.call(this, target, [
        [20, 0],
        [0, 20 * Math.sqrt(3)],
        [40, 20 * Math.sqrt(3)],
    ]);

    this.type("TriangleSVG");
}

TriangleSVG.prototype = {
    ...PolygonSVG.prototype,
};

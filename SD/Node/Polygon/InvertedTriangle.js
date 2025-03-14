import { BasePolygon } from "@/Node/Polygon/BasePolygon";

export function InvertedTriangle(parent) {
    BasePolygon.call(this, parent, [
        [20, 20 * Math.sqrt(3)],
        [0, 0],
        [40, 0],
    ]);

    this.type("InvertedTriangle");
}

InvertedTriangle.prototype = {
    ...BasePolygon.prototype,
};

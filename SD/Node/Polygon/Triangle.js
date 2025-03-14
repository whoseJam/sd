import { BasePolygon } from "@/Node/Polygon/BasePolygon";

export function Triangle(parent) {
    BasePolygon.call(this, parent, [
        [20, 0],
        [0, 20 * Math.sqrt(3)],
        [40, 20 * Math.sqrt(3)],
    ]);

    this.type("Triangle");
}

Triangle.prototype = {
    ...BasePolygon.prototype,
};

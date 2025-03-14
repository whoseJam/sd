import { Polygon } from "@/Node/Nake/Polygon";

export function BasePolygon(parent, points) {
    Polygon.call(this, parent, points);

    this._.BASE_POLYGON = true;
}

BasePolygon.prototype = {
    ...Polygon.prototype,
};

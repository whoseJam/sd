import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { polygon } from "@flatten-js/core";

export function Polygon(target, points = []) {
    const { PolygonSVG } = require("@/Node/SVG/Shape/PolygonSVG");
    return new PolygonSVG(target, points);
}

Polygon.prototype = {
    toPolygon() {
        return polygon(this.vars.points.map(v => v));
    },
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        const dx = x - this.x();
        this.vars.x = x;
        return this.__points(this.points().map(v => [v[0] + dx, v[1]]));
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        const dy = y - this.y();
        this.vars.y = y;
        return this.__points(this.points().map(v => [v[0], v[1] + dy]));
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        const x = this.x();
        const k = width / this.width();
        this.vars.width = width;
        return this.__points(this.points().map(v => [(v[0] - x) * k + x, v[1]]));
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        const y = this.y();
        const k = height / this.height();
        this.vars.height = height;
        return this.__points(this.points().map(v => [v[0], (v[1] - y) * k + y]));
    },
    points(points) {
        if (arguments.length === 0) return this.vars.points;
        this.__points(points);
        const box = Cast.castPointsToBox(points);
        this.vars.x = box.x;
        this.vars.y = box.y;
        this.vars.width = box.width;
        this.vars.height = box.height;
        return this;
    },
    __points: Factory.handler("points"),
};

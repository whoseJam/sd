import { Vector as V } from "@/Math/Vector";
import { Line } from "@/Node/SVG/Line";
import { Path } from "@/Node/SVG/Path";
import { Factory } from "@/Utility/Factory";

export function BaseCurve(parent) {
    Path.call(this, parent);

    this.vars.merge({
        x1: 0,
        y1: 0,
        x2: 40,
        y2: 40,
        update: false,
    });
}

BaseCurve.prototype = {
    ...Path.prototype,
    BASE_CURVE: true,
    x1: Factory.handler("x1"),
    y1: Factory.handler("y1"),
    x2: Factory.handler("x2"),
    y2: Factory.handler("y2"),
    source: Line.prototype.source,
    target: Line.prototype.target,
    dx(dx) {
        this.freeze();
        this.source(V.add(this.source(), [dx, 0]));
        this.target(V.add(this.target(), [dx, 0]));
        this.unfreeze();
        return this;
    },
    dy(dy) {
        this.freeze();
        this.source(V.add(this.source(), [0, dy]));
        this.target(V.add(this.target(), [0, dy]));
        this.unfreeze();
        return this;
    },
};

export function curveHandler(key) {
    return function (value) {
        if (value === undefined) return this.vars[key];
        this.vars[key] = value;
        this.vars.update = true;
        return this;
    };
}

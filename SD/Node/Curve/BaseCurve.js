import { Vector as V } from "@/Math/Vector";
import { LineSVG } from "@/Node/SVG/Path/LineSVG";
import { PathSVG } from "@/Node/SVG/Path/PathSVG";
import { Factory } from "@/Utility/Factory";

export function BaseCurve(parent) {
    PathSVG.call(this, parent);

    this.vars.merge({
        x1: 0,
        y1: 0,
        x2: 40,
        y2: 40,
        update: false,
    });
}

BaseCurve.prototype = {
    ...PathSVG.prototype,
    BASE_CURVE: true,
    x1: Factory.handler("x1"),
    y1: Factory.handler("y1"),
    x2: Factory.handler("x2"),
    y2: Factory.handler("y2"),
    source: LineSVG.prototype.source,
    target: LineSVG.prototype.target,
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

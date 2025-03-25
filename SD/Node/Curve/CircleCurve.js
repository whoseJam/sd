import { BaseCurve, curveHandler } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function CircleCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("CircleCurve");

    this.vars.merge({
        r: 20,
    });

    this.effect("circleCurve", () => {
        const r = this.r();
        const x1 = this.x1();
        const y1 = this.y1();
        let x2 = this.x2();
        const y2 = this.y2();
        if (x1 === x2 && y1 === y2) x2++;
        const pen = new PathPen().MoveTo(x1, y1).Arc(r, r, 0, 1, 1, x2, y2);
        this.d(pen.toString());
    });
}

CircleCurve.prototype = {
    ...BaseCurve.prototype,
    r: curveHandler("r"),
};

import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function VHBezier(parent) {
    BaseCurve.call(this, parent);

    this.type("VHBezier");

    this.effect("VHBezier", () => {
        const v1 = [this.x1(), this.y1()];
        const v2 = [this.x2(), this.y2()];
        let d = V.sub(v2, v1);
        let p1;
        let p2;
        let pm;
        pm = V.add(v1, V.numberMul(d, 0.5));
        if (d[0] < d[1]) {
            p1 = [v1[0], v1[1] + d[1] * 0.5];
            p2 = [v2[0], v2[1] - d[1] * 0.5];
        } else {
            p1 = [v1[0] + d[0] * 0.5, v1[1]];
            p2 = [v2[0] - d[0] * 0.5, v2[1]];
        }
        const pen = new PathPen().MoveTo(v1).Quad(p1, pm).Quad(p2, v2);
        this.d(pen.toString());
    });
}

VHBezier.prototype = {
    ...BaseCurve.prototype,
};

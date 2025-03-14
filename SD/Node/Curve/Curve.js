import { Vector as V } from "@/Math/Vector";
import { effect } from "@/Node/Core/Reactive";
import { BaseCurve, curveHandler } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function Curve(parent) {
    BaseCurve.call(this, parent);

    this.type("Curve");

    this.vars.merge({
        bending: 0.25,
    });

    this._.updater = effect(() => {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        const dis = V.length(d);
        const left = V.norm(V.rotate(d, Math.PI / 2));
        const vc = V.add(V.add(v1, V.numberMul(d, 0.5)), V.numberMul(left, dis * this.bending()));
        const pen = new PathPen().MoveTo(v1).Quad(vc, v2);
        this.d(pen.toString());
    });
}

Curve.prototype = {
    ...BaseCurve.prototype,
    bending: curveHandler("bending"),
};

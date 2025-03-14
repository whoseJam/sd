import { Vector as V } from "@/Math/Vector";
import { effect } from "@/Node/Core/Reactive";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function Bezier(parent) {
    BaseCurve.call(this, parent);

    this.type("Bezier");

    this._.updater = effect(() => {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        const d1q = V.numberMul(d, 0.25);
        const d3q = V.numberMul(d, 0.75);
        const pc1 = V.add(V.add(v1, d1q), V.rotate(d1q, Math.PI / 2));
        const pm = V.add(v1, V.numberMul(d, 0.5));
        const pc2 = V.add(V.add(v1, d3q), V.rotate(d1q, -Math.PI / 2));
        const pen = new PathPen().MoveTo(v1).Quad(pc1, pm).Quad(pc2, v2);
        this.d(pen.toString());
    });
}

Bezier.prototype = {
    ...BaseCurve.prototype,
};

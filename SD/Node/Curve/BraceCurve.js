import { Vector as V } from "@/Math/Vector";
import { BaseCurve, curveHandler } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function BraceCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("BraceCurve");

    this.vars.merge({
        bending: 5,
    });

    this.effect("curve", () => {
        const vs = this.source();
        const vt = this.target();
        const vc = V.numberMul(V.add(vs, vt), 0.5);
        const d = V.numberMul(V.norm(V.sub(vt, vs)), this.bending());
        const dl = V.rotate(d, -Math.PI / 2);
        const p1 = V.add(vs, dl);
        const p2 = V.add(p1, d);
        const c2 = V.add(vc, dl);
        const c1 = V.sub(c2, d);
        const c3 = V.add(c2, d);
        const c = V.add(c2, dl);
        const p4 = V.add(vt, dl);
        const p3 = V.sub(p4, d);
        const pen = new PathPen();
        pen.MoveTo(vs).Quad(p1, p2);
        pen.LinkTo(c1).Quad(c2, c).Quad(c2, c3);
        pen.LinkTo(p3).Quad(p4, vt);
        this.d(pen.toString());
    });
}

BraceCurve.prototype = {
    ...BaseCurve.prototype,
    bending: curveHandler("bending"),
};

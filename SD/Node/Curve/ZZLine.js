import { Vector as V } from "@/Math/Vector";
import { BaseCurve, curveHandler } from "@/Node/Curve/BaseCurve";
import { PathPen } from "@/Utility/PathPen";

export function ZZLine(parent) {
    BaseCurve.call(this, parent);

    this.type("ZZLine");

    this.vars.merge({
        bending: 0.25,
        location: "b",
    });

    this.effect("curve", () => {
        const s = this.source();
        const t = this.target();
        const bending = this.bending();
        const location = this.location();
        // index     - 变化量参考轴
        // index ^ 1 - 突起的轴
        const index = location === "l" || location === "r" ? 1 : 0;
        const sign = location === "l" || location === "t" ? -1 : 1;
        const distance = sign * (bending > 3 ? bending : Math.abs(s[index] - t[index]) * bending);

        // 中间点计算
        const operator = location === "l" || location === "t" ? "min" : "max";
        const d = index === 0 ? [0, distance] : [distance, 0];
        const ds = V.add(s, d);
        const dt = V.add(t, d);
        ds[index ^ 1] = dt[index ^ 1] = Math[operator](ds[index ^ 1], dt[index ^ 1]);

        const pen = new PathPen();
        pen.MoveTo(s).LinkTo(ds).LinkTo(dt).LinkTo(t);

        this.d(pen.toString());
    });
}

ZZLine.prototype = {
    ...BaseCurve.prototype,
    bending: curveHandler("bending"),
    location: curveHandler("location"),
};

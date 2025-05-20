import { Interp } from "@/Animate/Interp";
import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { BufferGeometry, LineBasicMaterial, LineCurve3, Line as LineFromThree, Vector3 } from "three";

export function Line3D(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        x1: 0,
        y1: 0,
        z1: 0,
        x2: 1,
        y2: 1,
        z2: 0,
    });

    const _s = new Vector3(this.vars.x1, this.vars.y1, this.vars.z1);
    const _t = new Vector3(this.vars.x2, this.vars.y2, this.vars.z2);
    this._.curve = new LineCurve3(_s, _t);
    this._.geometry = new BufferGeometry().setFromPoints(this._.curve.getPoints(2));
    this._.material = new LineBasicMaterial({ color: C.black });
    this._.line = new LineFromThree(this._.geometry, this._.material);
    this._.scene.add(this._.line);

    const helper = createHelper(this._.curve, this._.geometry);
    this.vars.associate("x1", Factory.action(this, helper, "x1", Interp.numberInterp));
    this.vars.associate("y1", Factory.action(this, helper, "y1", Interp.numberInterp));
}

Line3D.prototype = {
    ...BaseThree.prototype,
    x1: Factory.handlerLowPrecise("x1"),
    y1: Factory.handlerLowPrecise("y1"),
    z1: Factory.handlerLowPrecise("z1"),
    x2: Factory.handlerLowPrecise("x2"),
    y2: Factory.handlerLowPrecise("y2"),
    z2: Factory.handlerLowPrecise("z2"),
    source(x, y, z) {
        if (arguments.length === 0) return [this.x1(), this.y1(), this.z1()];
        if (arguments.length === 1) return this.source(x[0], x[1], x[2]);
        return this.freeze().x1(x).y1(y).z1(z).unfreeze();
    },
    target(x, y, z) {
        if (arguments.length === 0) return [this.x2(), this.y2(), this.z2()];
        if (arguments.length === 1) return this.target(x[0], x[1], x[2]);
        return this.freeze().x2(x).y2(y).z2(x).unfreeze();
    },
};

function createHelper(curve, geometry) {
    return {
        setAttribute(key, value) {
            const a = key.slice(1, 2);
            const b = key.slice(0, 1);
            curve[`v${a}`][b] = value;
            geometry.setFromPoints(curve.getPoints(2));
        },
    };
}

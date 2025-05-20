import { SD3DNode } from "@/Node/SD3DNode";
import { Scene } from "@/Node/Three/Scene";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseThree(target) {
    if (target instanceof Scene) ErrorLauncher.invalidArguments();
    SD3DNode.call(this, target);
    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
    });
    this._.scene = target._.scene;
}

BaseThree.prototype = {
    ...SD3DNode.prototype,
    BASE_THREE: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    z: Factory.handlerLowPrecise("z"),
    position(x, y, z) {
        if (arguments.length === 0) return [this.x(), this.y(), this.z()];
        if (arguments.length === 1) return this.position(x[0], x[1], x[2]);
        return this.freeze().x(x).y(y).z(z).unfreeze();
    },
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    rz: Factory.handlerLowPrecise("rz"),
    rotation(x, y, z) {
        if (arguments.length === 0) return [this.rx(), this.ry(), this.rz()];
        if (arguments.length === 1) return this.rotation(x[0], x[1], x[2]);
        return this.freeze().x(x).y(y).z(z).unfreeze();
    },
};

import { SD3DNode } from "@/Node/SD3DNode";
import { Factory } from "@/Utility/Factory";

export function BaseThree(parent) {
    SD3DNode.call(this, parent);
}

BaseThree.prototype = {
    ...SD3DNode.prototype,
    BASE_THREE: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    z: Factory.handlerLowPrecise("z"),
    position(position) {
        this.freeze();
        this.x(position[0]);
        this.y(position[1]);
        this.z(position[2]);
        this.unfreeze();
    },
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    rz: Factory.handlerLowPrecise("rz"),
    rotation(rotation) {
        this.freeze();
        this.rx(rotation[0]);
        this.ry(rotation[1]);
        this.rz(rotation[2]);
        this.unfreeze();
    },
};

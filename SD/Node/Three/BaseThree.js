import { SDNode } from "@/Node/SDNode";
import { Factory } from "@/Utility/Factory";

export function BaseThree(parent) {
    SDNode.call(this, parent);
}

BaseThree.prototype = {
    ...SDNode.prototype,
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

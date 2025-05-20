import { BaseThree } from "@/Node/Three/BaseThree";
import { Factory } from "@/Utility/Factory";

export function BaseShape3D(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        cx: 0,
        cy: 0,
    });
}

BaseShape3D.prototype = {
    ...BaseThree.prototype,
    BASE_SHAPE: true,
    BASE_SHAPE_3D: true,
    x(x) {
        if (arguments.length === 0) return this.cx() - this.width() / 2;
        return this.cx(x + this.width() / 2);
    },
    y(y) {
        if (arguments.length === 0) return this.cy() - this.height() / 2;
        return this.cy(y + this.height() / 2);
    },
    cx: Factory.handlerLowPrecise("cx"),
    cy: Factory.handlerLowPrecise("cy"),
};

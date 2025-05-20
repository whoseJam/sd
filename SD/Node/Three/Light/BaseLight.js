import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseLight(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        color: C.white,
        intensity: 1,
    });
}

BaseLight.prototype = {
    ...BaseThree.prototype,
    BASE_LIGHT: true,
    color: Factory.handler("color"),
    intensity: Factory.handlerMediumPrecise("intensity"),
};

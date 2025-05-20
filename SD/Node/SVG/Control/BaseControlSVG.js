import { Interp } from "@/Animate/Interp";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Factory } from "@/Utility/Factory";

export function BaseControlSVG(target) {
    BaseSVG.call(this, target, "foreignObject");

    this.vars.merge({
        x: 0,
        y: 0,
    });

    this._.foreign = this._.nake;
    this._.foreign.setAttribute("x", 0);
    this._.foreign.setAttribute("y", 0);

    this.vars.associate("x", Factory.action(this, this._.foreign, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.foreign, "y", Interp.numberInterp));
    this.vars.associate("width", Factory.action(this, this._.foreign, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, this._.foreign, "height", Interp.numberInterp));
}

BaseControlSVG.prototype = {
    ...BaseSVG.prototype,
    BASE_CONTROL: true,
    BASE_CONTROL_SVG: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    control() {
        return this._.control;
    },
};

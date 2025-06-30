import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/Shape/BaseHTML";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Factory } from "@/Utility/Factory";

export class EllipseHTML extends BaseShape {
    constructor(target) {
        super(target, "div");

        BaseHTML.call(this, "div");

        this.type("EllipseHTML");

        this.vars.merge({
            x: 0,
            y: 0,
            rx: 20,
            ry: 20,
        });

        this._.layer.setAttribute("width", `${this.vars.rx * 2}px`);
        this._.layer.setAttribute("height", `${this.vars.ry * 2}px`);
        this._.nake.setAttribute("border-radius", "50%");

        const helper = createHelper(this._.layer);
        this.vars.watch("rx", Factory.action(this, helper, "width", Interp.numberInterp));
        this.vars.watch("ry", Factory.action(this, helper, "height", Interp.numberInterp));
    }
}

EllipseHTML.extend(Ellipse);

Object.assign(EllipseHTML.prototype, {
    ...Ellipse.prototype,
    ...BaseHTML.prototype,
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    width(width) {
        if (arguments.length === 0) return this.vars.rx * 2;
        return this.rx(width / 2);
    },
    height(height) {
        if (arguments.length === 0) return this.vars.ry * 2;
        return this.ry(height / 2);
    },
});

function createHelper(layer) {
    return {
        setAttribute(key, value) {
            layer.setAttribute(key, `${value * 2}px`);
        },
    };
}

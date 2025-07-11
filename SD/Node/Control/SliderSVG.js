import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { BaseSVG } from "@/Node/Control/BaseSVG";
import { Slider } from "@/Node/Control/Slider";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class SliderSVG extends BaseControl {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "input");

        this.type("SliderSVG");

        this.vars.width = 80;
        this.vars.height = 20;
        this.vars.merge({
            min: 0,
            max: 10,
            value: 0,
        });

        this._.nake.setAttribute("type", "range");
        this._.nake.setAttribute("min", this.vars.min);
        this._.nake.setAttribute("max", this.vars.max);
        this._.nake.setAttribute("value", this.vars.value);

        Dom.addEventListener(this._.nake.nake(), "mousedown", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(this._.nake.nake(), "touchstart", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(this._.nake.nake(), "change", e => {
            this.value(+e.target.value);
        });

        this.vars.watch("max", Factory.action(this, this._.nake, "max", Interp.numberInterp));
        this.vars.watch("min", Factory.action(this, this._.nake, "min", Interp.numberInterp));
        this.vars.watch("value", Factory.action(this, this._.nake, "value", Interp.numberInterp));
    }
}

SliderSVG.extend(Slider);

Object.assign(SliderSVG.prototype, {
    ...BaseSVG.prototype,
    max(value) {
        if (arguments.length === 0) return this.vars.max;
        Check.validateNumber(+value, `${this.constructor.name}.max`);
        this.vars.max = +value;
        if (this.value() > +value) this.value(+value);
        return this;
    },
    min(value) {
        if (arguments.length === 0) return this.vars.min;
        Check.validateNumber(+value, `${this.constructor.name}.min`);
        this.vars.min = +value;
        if (this.value() < +value) this.value(+value);
        return this;
    },
    value(value) {
        if (arguments.length === 0) return this.vars.value;
        Check.validateNumber(+value, `${this.constructor.name}.value`);
        this.vars.value = +value;
        return this;
    },
});

import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { BaseSVG } from "@/Node/Control/BaseSVG";
import { Input } from "@/Node/Control/Input";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class InputSVG extends BaseControl {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "input");

        this.type("InputSVG");

        this.vars.width = 120;
        this.vars.height = 25;
        this.vars.merge({
            value: "",
        });

        this._.nake.setAttribute("type", "text");

        Dom.addEventListener(this._.nake.nake(), "beforeinput", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(this._.nake.nake(), "change", e => {
            this.value(e.target.value);
        });

        this.vars.watch("value", Factory.action(this, this._.nake, "value", Interp.stringInterp));
    }
}

InputSVG.extend(Input);

Object.assign(InputSVG.prototype, {
    ...BaseSVG.prototype,
    value(value) {
        if (arguments.length === 0) return this.vars.value;
        Check.isNumberOrString(value, `${this.constructor.name}.value`);
        this.vars.value = value;
        return this;
    },
});

import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { BaseHTML } from "@/Node/Control/BaselHTML";
import { TextArea } from "@/Node/Control/TextArea";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class TextAreaHTML extends BaseControl {
    constructor(target) {
        super(target);

        BaseHTML.call(this, "textarea");

        this.type("TextAreaHTML");

        this.vars.width = 80;
        this.vars.height = 100;
        this.vars.merge({
            value: "",
        });

        Dom.addEventListener(this._.nake.nake(), "beforeinput", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(this._.nake.nake(), "change", e => {
            this.value(e.target.value);
        });

        this.vars.watch("value", Factory.action(this, this._.nake, "value", Interp.stringInterp));
    }
}

TextAreaHTML.extend(TextArea);

Object.assign(TextAreaHTML.prototype, {
    ...BaseHTML.prototype,
    value(value) {
        if (arguments.length === 0) return this.vars.value;
        Check.isNumberOrString(value, `${this.constructor.name}.value`);
        this.vars.value = value;
        return this;
    },
});

import { Interp } from "@/Animate/Interp";
import { BaseControl } from "@/Node/Control/BaseControl";
import { BaseSVG } from "@/Node/Control/BaseSVG";
import { Button } from "@/Node/Control/Button";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class ButtonSVG extends BaseControl {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "button");

        this.type("ButtonSVG");

        this.vars.width = 60;
        this.vars.height = 25;
        this.vars.fill = C.buttonGrey;
        this.vars.stroke = C.darkButtonGrey;
        this.vars.merge({
            text: "点击",
        });

        this._.nake.setAttribute("text", "点击");

        this.vars.watch("text", Factory.action(this, this._.nake, "text", Interp.stringInterp));
    }
}

ButtonSVG.extend(Button);

Object.assign(ButtonSVG.prototype, {
    ...BaseSVG.prototype,
    text(text) {
        if (arguments.length === 0) return this.vars.text;
        Check.validateNumberOrString(text, `${this.constructor.name}.text`);
        this.vars.text = text;
        return this;
    },
});

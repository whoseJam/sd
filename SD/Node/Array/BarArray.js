import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { RectSVG } from "@/Node/Shape/RectSVG";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export class BarArray extends BaseArray {
    constructor(target) {
        super(target);

        this.type("BarArray");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.type()}.constructor`);

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
            height: 0,
        });

        this.effect("barArray", () => {
            const y = this.my();
            let maxHeight = 0;
            this.vars.elements.forEach((element, i) => {
                this.tryUpdate(element, () => {
                    element.width(this.elementWidth());
                    element.height(this.elementHeight() * element.value());
                    element.x(this.x() + i * this.elementWidth());
                    element.my(y);
                    maxHeight = Math.max(maxHeight, this.elementHeight() * element.value());
                });
            });
            this.vars.height = maxHeight;
            this.vars.y = y - maxHeight;
        });
    }
}

Object.assign(BarArray.prototype, {
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    intValue(idx) {
        return this.value(idx);
    },
    width: Array.prototype.width,
    height(height) {
        if (height === undefined) return this.vars.height;
        const elements = this.vars.elements;
        let maxValue = elements.reduce((maxValue, element) => Math.max(maxValue, element.value()));
        this.elementHeight(height / Math.max(1, maxValue));
        return this;
    },
    insert(id, value) {
        value = +value;
        if (typeof value !== "number") ErrorLauncher.invalidArguments();
        const element = new RectSVG(this.layer("elements")).opacity(0);
        element.vars.merge({
            value,
        });
        element.value = function (value) {
            if (arguments.length === 0) return this.vars.value;
            this.vars.value = value;
            return this;
        };
        element.intValue = function (value) {
            if (arguments.length === 0) return this.vars.value;
            this.vars.value = value;
            return this;
        };
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.__insert(id, element);
        return this;
    },
});

BarArray.prototype.insertFromExistElement = BarArray.prototype.insertFromExistValue;

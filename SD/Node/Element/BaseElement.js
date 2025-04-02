import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { SD2DNode } from "@/Node/SD2DNode";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseElement(parent) {
    SD2DNode.call(this, parent);

    this.newLayer("background");
    this.newLayer("value");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        rate: 1.3,
        value: undefined,
    });
}

BaseElement.prototype = {
    ...SD2DNode.prototype,
    BASE_ELEMENT: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    rate: Factory.handlerMediumPrecise("rate"),
    color: backgroundHandler("color"),
    fill: backgroundHandler("fill"),
    fillOpacity: backgroundHandler("fillOpacity"),
    stroke: backgroundHandler("stroke"),
    strokeOpacity: backgroundHandler("strokeOpacity"),
    strokeWidth: backgroundHandler("strokeWidth"),
    background() {
        return this.child("background");
    },
    text(text) {
        const value = this.child("value");
        if (!value) return "";
        if (!value.text) ErrorLauncher.invalidInvoke("text");
        if (arguments.length === 0) return value.text();
        value.text(text);
        return this;
    },
    intValue() {
        const value = this.value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        const i = Math.floor(+value.text());
        if (isNaN(i)) ErrorLauncher.invalidInvoke("intValue");
        return i;
    },
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmptyType(value)) return this;
        rule = getValueRule(rule);
        value = Cast.castToSDNode(this, value);
        value.onEnterDefault(EN.appear("value"));
        value.onExitDefault(EX.fade());
        this.childAs("value", value, rule);
        return this;
    },
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        rule = getValueRule(rule);
        value.onEnter(EN.moveTo("value"));
        value.onExitDefault(EX.fade());
        this.childAs("value", value, rule);
        return this;
    },
    drop() {
        const value = this.child("value");
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    },
};

function backgroundHandler(key) {
    return function (value) {
        const background = this.child("background");
        if (value === undefined) return background[key]();
        background[key](value);
        return this;
    };
}

function getValueRule(rule) {
    return (
        rule ||
        function (parent, child) {
            const rate = parent.rate();
            R.centerFixAspect(rate)(parent, child);
        }
    );
}

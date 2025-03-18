import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";

function inputCallback() {
    if (this._.onChange) this._.onChange(this._.nake.getAttribute("value"));
}

export function Input(parent) {
    BaseHTML.call(this, parent);

    this._.onChange = undefined;

    this.vars.merge({
        x: 0,
        y: 0,
        width: 120,
        height: 25,
        label: "",
    });

    this._.layer.setAttribute("width", "120px");
    this._.layer.setAttribute("height", "25px");
    this._.layer.setAttribute("display", "flex");
    this._.label = createRenderNode(this, this._.layer, "label");
    this._.label.setAttribute("flex-shrink", 0);
    this._.label.setAttribute("height", "100%");
    this._.label.setAttribute("white-space", "nowrap");
    this._.nake = createRenderNode(this, this._.layer, "input");
    this._.nake.setAttribute("flex-grow", 1);
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    this._.nake.setAttribute("type", "text");
    this._.nake.setAttribute("value", "");
    this._.nake.setAttribute("pointer-events", "auto");
    this._.nake.setAttribute("onchange", inputCallback.bind(this));

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    this.vars.associate("label", Factory.action(this, this._.label, "text", Interp.stringInterp));
}

Input.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    label: Factory.handler("label"),
    onChange(callback) {
        if (callback === undefined) return this._.onChange;
        this._.onChange = callback;
        return this;
    },
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};

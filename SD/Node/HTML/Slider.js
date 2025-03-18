import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";

function sliderCallback() {
    if (this._.onChange) this._.onChange(this.value());
}

export function Slider(parent) {
    BaseHTML.call(this, parent);

    this.type("Slider");

    this._.onChange = undefined;

    this.vars.merge({
        x: 0,
        y: 0,
        width: 80,
        height: 20,
    });

    this._.layer.setAttribute("width", "80px");
    this._.layer.setAttribute("height", "20px");
    this._.nake = createRenderNode(this, this._.layer, "input");
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    this._.nake.setAttribute("type", "range");
    this._.nake.setAttribute("min", 0);
    this._.nake.setAttribute("max", 10);
    this._.nake.setAttribute("pointer-events", "auto");
    this._.nake.setAttribute("onchange", sliderCallback.bind(this));

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
}

Slider.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    onChange(callback) {
        if (callback === undefined) return this._.onChange;
        this._.onChange = callback;
        return this;
    },
    max(value) {
        if (value === undefined) return +this._.nake.getAttribute("max");
        this._.nake.setAttribute("max", value);
        return this;
    },
    min(value) {
        if (value === undefined) return +this._.nake.getAttribute("min");
        this._.nake.setAttribute("min", value);
        return this;
    },
    value(value) {
        if (value === undefined) return +this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        if (this._.onChange) this._.onChange(value);
        return this;
    },
};

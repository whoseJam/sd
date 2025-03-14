import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";
import { Color as C } from "@/Utility/Color";
import { BaseNake } from "@/Node/Nake/BaseNake";

function buttonCallback() {
    if (this._.onClick) this._.onClick();
}

export function Button(parent) {
    BaseHTML.call(this, parent);

    this._.onClick = undefined;

    this.vars.merge({
        x: 0,
        y: 0,
        width: 60,
        height: 25,
        fill: C.buttonGrey,
        stroke: C.darkButtonGrey,
    });

    this._.layer.setAttribute("width", "60px");
    this._.layer.setAttribute("height", "25px");
    this._.nake = createRenderNode(this, this._.layer, "button");
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    this._.nake.setAttribute("text", "点击");
    this._.nake.setAttribute("pointer-events", "auto");
    this._.nake.setAttribute("onclick", buttonCallback.bind(this));

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    this.vars.associate("fill", Factory.action(this, this._.nake, "background-color", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "border-color", Interp.colorInterp));
}

Button.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color: BaseNake.prototype.color,
    onClick(callback) {
        if (callback === undefined) return this._.onClick;
        this._.onClick = callback;
        return this;
    },
    text(value) {
        if (value === undefined) return this._.nake.getAttribute("text");
        this._.nake.setAttribute("text", value);
        return this;
    },
};

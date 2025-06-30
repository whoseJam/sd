import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { BaseElement } from "@/Node/Element/BaseElement";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseSVG(label) {
    this.vars.merge({
        fill: C.white,
        fillOpacity: 0,
        stroke: C.black,
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashOffset: 0,
        strokeDashArray: [1, 0],
        markerStart: "",
        markerMid: "",
        markerEnd: "",
        value: undefined,
    });

    this._.nake = createRenderNode(this, this._.layer, label);
    this._.nake.setAttribute("fill", this.vars.fill);
    this._.nake.setAttribute("stroke", this.vars.stroke);
    this._.nake.setAttribute("fill-opacity", this.vars.fillOpacity);

    this.vars.watch("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.watch("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
    this.vars.watch("fillOpacity", Factory.action(this, this._.nake, "fill-opacity", Interp.numberInterp));
    this.vars.watch("strokeOpacity", Factory.action(this, this._.nake, "stroke-opacity", Interp.numberInterp));
    this.vars.watch("strokeWidth", Factory.action(this, this._.nake, "stroke-width", Interp.numberInterp));
    this.vars.watch("strokeDashOffset", Factory.action(this, this._.nake, "stroke-dashoffset", Interp.numberInterp));
    this.vars.watch("strokeDashArray", Factory.action(this, this._.nake, "stroke-dasharray", Interp.arrayInterp));
    this.vars.watch("markerStart", Factory.action(this, this._.nake, "marker-start", Interp.stringInterp));
    this.vars.watch("markerMid", Factory.action(this, this._.nake, "marker-mid", Interp.stringInterp));
    this.vars.watch("markerEnd", Factory.action(this, this._.nake, "marker-end", Interp.stringInterp));
}

BaseSVG.prototype = {
    fill(fill) {
        if (arguments.length === 0) return this.vars.fill;
        Check.validateColor(fill, `${this.constructor.name}.fill`);
        this.vars.fill = fill;
        return this;
    },
    stroke(stroke) {
        if (arguments.length === 0) return this.vars.stroke;
        Check.validateColor(stroke, `${this.constructor.name}.stroke`);
        this.vars.stroke = stroke;
        return this;
    },
    fillOpacity(opacity) {
        if (arguments.length === 0) return this.vars.fillOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.fillOpacity`);
        this.vars.fillOpacity = opacity;
        return this;
    },
    strokeOpacity(opacity) {
        if (arguments.length === 0) return this.vars.strokeOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.strokeOpacity`);
        this.vars.strokeOpacity = opacity;
        return this;
    },
    strokeWidth(width) {
        if (arguments.length === 0) return this.vars.strokeWidth;
        Check.validateNumber(width, `${this.constructor.name}.strokeWidth`);
        this.vars.strokeWidth = width;
        return this;
    },
    strokeDashOffset(offset) {
        if (arguments.length === 0) return this.vars.strokeDashOffset;
        Check.validateNumber(offset, `${this.constructor.name}.strokeDashOffset`);
        this.vars.strokeDashOffset = offset;
        return this;
    },
    strokeDashArray(array) {
        if (arguments.length === 0) return this.vars.strokeDashArray;
        this.vars.strokeDashArray = array;
        return this;
    },
    color(color) {
        if (arguments.length === 0)
            return {
                fill: this.fill(),
                stroke: this.stroke(),
            };
        Check.validateColor(color);
        if (typeof color === "string") this.fill(color).stroke(color);
        else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
    markerStart: handlerMarker("markerStart"),
    markerMid: handlerMarker("markerMid"),
    markerEnd: handlerMarker("markerEnd"),
    arrow(arrow = true) {
        return this.markerEnd(arrow ? "arrow" : "");
    },
    revArrow(arrow = true) {
        return this.markerStart(arrow ? "arrow" : "");
    },
    doubleArrow(arrow = true) {
        return this.arrow(arrow).revArrow(arrow);
    },
    pointStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([0, len]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        return this;
    },
    pointTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        this.strokeDashOffset(0);
        return this;
    },
    fadeStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        this.strokeDashOffset(-len);
        return this;
    },
    fadeTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, 0]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        return this;
    },
    at(k) {
        ErrorLauncher.notImplementedYet("at", this.type());
    },
    getPointAtLength(length) {
        ErrorLauncher.notImplementedYet("getPointAtLength", this.type());
    },
    totalLength() {
        ErrorLauncher.notImplementedYet("totalLength", this.type());
    },
    text: BaseElement.prototype.text,
    intValue: BaseElement.prototype.intValue,
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        rule = getValueRule(rule);
        value = Cast.castToSDNode(this, value);
        this.childAs("value", value, rule);
        return this;
    },
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        rule = getValueRule(rule);
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule);
        return this;
    },
    drop: BaseElement.prototype.drop,
};

function handlerMarker(key) {
    return function (marker) {
        if (marker === undefined) return this.vars[key];
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars[key] = marker;
        return this;
    };
}

function getValueRule(rule) {
    return rule ? rule : R.pointAtPathByRate(0.5, "cx", "cy");
}

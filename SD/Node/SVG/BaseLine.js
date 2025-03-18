import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseLine(parent, tag) {
    BaseSVG.call(this, parent, tag);

    this.vars.fillOpacity = 0;
    this.vars.strokeOpacity = 1;
    this.vars.strokeWidth = 1;
    this.vars.stroke = C.black;
    this.vars.merge({
        markerStart: "",
        markerMid: "",
        markerEnd: "",
        value: undefined,
    });

    this.vars.associate("markerStart", Factory.action(this, this._.nake, "marker-start", Interp.stringInterp));
    this.vars.associate("markerMid", Factory.action(this, this._.nake, "marker-mid", Interp.stringInterp));
    this.vars.associate("markerEnd", Factory.action(this, this._.nake, "marker-end", Interp.stringInterp));

    this._.BASE_LINE = true;
}

BaseLine.prototype = {
    ...BaseSVG.prototype,
    markerStart: handlerMarker("markerStart"),
    markerMid: handlerMarker("markerMid"),
    markerEnd: handlerMarker("markerEnd"),
    arrow(flag = true) {
        this.markerEnd(flag ? "arrow" : "");
        return this;
    },
    revArrow(flag = true) {
        this.markerStart(flag ? "arrowReverse" : "");
        return this;
    },
    doubleArrow(flag = true) {
        this.arrow(flag).revArrow(flag);
        return this;
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
    source(x, y) {
        if (arguments.length === 0) {
            return [this.x1(), this.y1()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.source(point[0], point[1]);
        }
        this.freeze().x1(x).y1(y).unfreeze();
        return this;
    },
    target(x, y) {
        if (arguments.length === 0) {
            return [this.x2(), this.y2()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.target(point[0], point[1]);
        }
        this.freeze().x2(x).y2(y).unfreeze();
        return this;
    },
    x(x) {
        const x1 = this.x1();
        const x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        const dx = x - ox;
        this.freeze();
        this.x1(x1 + dx);
        this.x2(x2 + dx);
        this.unfreeze();
        return this;
    },
    y(y) {
        const y1 = this.y1();
        const y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        const dy = y - oy;
        this.freeze();
        this.y1(y1 + dy);
        this.y2(y2 + dy);
        this.unfreeze();
        return this;
    },
    width(width) {
        const x1 = this.x1();
        const x2 = this.x2();
        if (width === undefined) return Math.abs(x1 - x2);
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    },
    height(height) {
        const y1 = this.y1();
        const y2 = this.y2();
        if (height === undefined) return Math.abs(y1 - y2);
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    },
    text() {
        const value = this.child("value");
        if (!value) return "";
        if (!value.text) ErrorLauncher.invalidInvoke("text");
        return value.text();
    },
    drop() {
        const value = this.child("value");
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    },
    intValue() {
        const value = this.value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isFalseType(value)) return this;
        rule = getValueRule(this.vars, rule);
        value = Cast.castToSDNode(this, value);
        value.onEnterDefault(EN.appear());
        value.onExitDefault(EX.fade());
        this.childAs("value", value, rule);
        return this;
    },
};

function handlerMarker(key) {
    return function (marker) {
        if (marker === undefined) return this.vars[key];
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars[key] = marker;
        return this;
    };
}

function getValueRule(vars, rule) {
    return rule ? rule : R.pointAtPathByRate(0.5, "cx", "cy");
}

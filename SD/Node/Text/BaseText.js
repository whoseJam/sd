import { SD2DNode } from "@/Node/SD2DNode";
import { Check } from "@/Utility/Check";

export class BaseText extends SD2DNode {}

Object.assign(BaseText.prototype, {
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    },
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
    color(color) {
        if (arguments.length === 0)
            return {
                fill: this.fill(),
                stroke: this.stroke(),
            };
        Check.validateColor(color);
        if (Check.isString(color)) this.fill(color).stroke(color);
        else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
    subtextColor(subtext, color, i = 0) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, i);
    },
    subtextColorAll(subtext, color) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "all");
    },
    subtextColorFirst(subtext, color) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "first");
    },
    subtextColorLast(subtext, color) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "last");
    },
});

import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { BaseText } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { createMathjaxRenderNode } from "@/Renderer/SVG/MathjaxNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class Mathjax extends BaseText {
    constructor(target, text = "") {
        super(target);

        this.type("Mathjax");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            text: "",
            fontSize: 20,
            elements: [],
            stroke: C.black,
            fill: C.black,
        });
        this._.frame = 0;
        this._.fills = [];
        this._.strokes = [];
        this._.transformings = [];

        const math = () => {
            return this._.math;
        };

        this.vars.watch("x", Factory.action(this, math, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, math, "y", Interp.numberInterp));
        this.vars.watch("fill", Factory.action(this, math, "fill", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, math, "stroke", Interp.colorInterp));
        this.vars.watch("fontSize", Factory.action(this, math, "font-size", Interp.numberInterp));
        this.vars.watch("x", x => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createMathjax("x", x));
        });
        this.vars.watch("y", y => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createMathjax("y", y));
        });
        this.vars.watch("fill", (newFill, oldFill) => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__createFill(newFill, oldFill);
            this.__currentTransforming(transforming => transforming.fill(newFill));
        });
        this.vars.watch("stroke", stroke => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(transforming => transforming.stroke(stroke));
        });
        this.vars.watch("fontSize", fontSize => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createMathjax("font-size", fontSize));
        });

        this.text(text);
    }
}

Object.assign(Mathjax.prototype, {
    fontSize(size) {
        if (arguments.length === 0) return this.vars.fontSize;
        Check.validateNumber(size, `${this.constructor.name}.fontSize`);
        if (this.vars.fontSize > 1e-1) {
            const k = size / this.vars.fontSize;
            this.vars.width *= k;
            this.vars.height *= k;
        } else {
            this._.math.setAttribute("font-size", size);
            const bbox = TextEngine.mathjaxBoundingBox(this._.math);
            this._.math.setAttribute("font-size", this.vars.fontSize);
            this.vars.width = bbox.width;
            this.vars.height = bbox.height;
        }
        this.vars.lpset("fontSize", size);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        }
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        }
        return this;
    },
    text(text, mapping = [], auto = true) {
        if (arguments.length === 0) return this.vars.text;
        text = String(text);
        if (text.startsWith("$")) text = text.slice(1, -1);
        const math = createMathjaxRenderNode(this, this._.layer, text);
        const box = TextEngine.mathjaxBoundingBox(math, false);
        if (this.duration() > 0) {
            const context = new Context(this);
            context.till(0, 0);
            this._.math.remove();
            context.till(0, 1);
            this.__createTransforming(this._.math, math, mapping, auto);
            context.till(1, 1);
            context.recover();
        } else this._.math?.remove();
        this._.math = math;
        this.vars.setTogether({
            text,
            width: box.width,
            height: box.height,
        });
        return this;
    },
    __subtextAttribute(subtext, attribute, operator) {
        subtext = String(subtext);
        const math = this.__cloneMathjax();
        const matched = TextEngine.findSubtextInMathjax(math, subtext);
        const update = match => {
            if (!match) return;
            const { element, start, length } = match;
            for (let i = start; i < start + length; i++) {
                for (const key in attribute) {
                    TextEngine.setAttributeInSubtree(element.children[i], key, attribute[key]);
                }
            }
        };
        if (operator === "all") matched.forEach(update);
        else if (operator === "first") update(matched[0]);
        else if (operator === "last") update(matched[matched.length - 1]);
        else update(matched[operator]);
        if (this.duration() > 0) {
            const context = new Context(this);
            context.till(0, 0);
            this._.math.remove();
            context.till(0, 1);
            this.__createTransforming(this._.math, math);
            context.till(1, 1);
            context.recover();
        } else this._.math?.remove();
        this._.math = math;
        return this;
    },
    __cloneMathjax() {
        const math = this._.math.clone();
        math.setAttribute("x", this.vars.x);
        math.setAttribute("y", this.vars.y);
        math.setAttribute("font-size", this.vars.fontSize);
        math.setAttribute("fill", this.vars.fill);
        math.setAttribute("stroke", this.vars.stroke);
        return math;
    },
    __flushTransformings() {
        if (this._.frame !== window.CURRENT_FRAME) {
            this._.frame = window.CURRENT_FRAME;
            this._.transformings = [];
            this._.fills = [];
            this._.strokes = [];
        }
    },
    __currentTransforming(callback) {
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) {
            if (transforming.l === l && transforming.r === r) {
                callback(transforming);
                return;
            }
        }
    },
    __createMathjax(key, value) {
        const math = this.__cloneMathjax();
        math.setAttribute(key, value);
        this.__createTransforming(this._.math, math);
        this._.math.remove();
        this._.math = math;
    },
    __createFill(newFill, oldFill) {
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const fill of this._.fills) {
            if (fill.l === l && fill.r === r) {
                this._.fills.target = newFill;
                return;
            }
        }
        this._.fills.push({
            l,
            r,
            source: oldFill,
            target: newFill,
        });
    },
    __sourceFill() {
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const fill of this._.fills) {
            if (fill.l === l && fill.r === r) return fill.source;
        }
        return C.black;
    },
    __sourceStroke() {
        return C.black;
    },
    __createTransforming(source, target, mapping = [], auto = true) {
        this.__flushTransformings();
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) {
            if (transforming.l === l && transforming.r === r) {
                transforming.replayByMathjax(target);
                return;
            }
        }
        this._.transformings.push(TextEngine.transformMathjax(this, source, target, mapping, auto));
    },
});

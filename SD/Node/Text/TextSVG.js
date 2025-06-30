import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { BaseSVG } from "@/Node/Text/BaseSVG";
import { BaseText } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";
import { make1d } from "@/Utility/Util";

function parseToHTML() {
    const attr = this._.attr;
    const template = this.vars.text;
    const equal = (i, j) => {
        if (attr[i].fill !== attr[j].fill) return false;
        if (attr[i].stroke !== attr[j].stroke) return false;
        return true;
    };
    const parseText = text => {
        let ans = "";
        text = String(text);
        for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") ans += "&emsp;";
            else if (text[i] === "<") ans += "&lt;";
            else if (text[i] === ">") ans += "&gt;";
            else ans += text[i];
        }
        return ans;
    };
    let html = "";
    for (let l = 0, r; l < template.length; l = r + 1) {
        r = l;
        while (r + 1 < template.length && equal(l, r + 1)) r++;
        html = html + `<tspan fill='${attr[l].fill}' stroke='${attr[l].stroke}' alignment-baseline='text-before-edge'>`;
        html = html + parseText(template.slice(l, r + 1));
        html = html + "</tspan>";
    }
    return html;
}

export class TextSVG extends BaseText {
    constructor(target, text = "") {
        super(target);

        BaseSVG.call(this, "text");

        this.type("TextSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            text: "",
            html: "",
            fontFamily: "Consolas",
            fontSize: 20,
            width: 0,
            height: 0,
        });
        this._.attr = [];
        this._.frame = 0;
        this._.transformings = [];

        this.vars.watch("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
        this.vars.watch("html", Factory.action(this, this._.nake, "innerHTML", Interp.stringInterp));
        this.vars.watch("fontSize", Factory.action(this, this._.nake, "font-size", Interp.numberInterp));
        this.vars.watch("fontFamily", Factory.action(this, this._.nake, "font-family", Interp.stringInterp));
        this.vars.watch("x", (newX, oldX) => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createTransforming({ x: oldX }, { x: newX }));
        });
        this.vars.watch("y", (newY, oldY) => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createTransforming({ y: oldY }, { y: newY }));
        });
        this.vars.watch("fill", fill => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(transforming => transforming.fill(fill));
        });
        this.vars.watch("stroke", stroke => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(transforming => transforming.stroke(stroke));
        });
        this.vars.watch("fontSize", (newSize, oldSize) => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createTransforming({ size: oldSize }, { size: newSize }));
        });
        this.vars.watch("fontFamily", (newFamily, oldFamily) => {
            if (this.duration() === 0) return;
            this.__flushTransformings();
            this.__currentTransforming(() => this.__createTransforming({ family: oldFamily }, { family: newFamily }));
        });
        this.effect("html", () => {
            this.vars.html = parseToHTML.call(this);
        });

        this._.nake.setAttribute("text-anchor", "start");
        this._.nake.setAttribute("alignment-baseline", "text-before-edge");
        this._.nake.setAttribute("x", this.vars.x);
        this._.nake.setAttribute("y", this.vars.y);
        this._.nake.setAttribute("font-size", this.vars.fontSize);
        this._.nake.setAttribute("font-family", "Consolas");

        this.text(text);
    }
}

Object.assign(TextSVG.prototype, {
    ...BaseSVG.prototype,
    fontSize(size) {
        if (arguments.length === 0) return this.vars.fontSize;
        Check.validateNumber(size, `${this.constructor.name}.fontSize`);
        if (this.vars.fontSize > 1e-1) {
            const k = size / this.vars.fontSize;
            this.vars.width *= k;
            this.vars.height *= k;
        } else {
            const box = TextEngine.fontSizeToBox(this.vars.text, fontSize);
            this.vars.width = box.width;
            this.vars.height = box.height;
        }
        this.vars.lpset("fontSize", size);
        return this;
    },
    fontFamily(family) {
        if (arguments.length === 0) return this.vars.fontFamily;
        this.vars.fontFamily = family;
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.widthToFontSize(this.text(), this.fontFamily(), width);
            this.fontSize(fontSize);
        }
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.heightToFontSize(this.text(), this.fontFamily(), height);
            this.fontSize(fontSize);
        }
        return this;
    },
    text(text) {
        if (arguments.length === 0) return this.vars.text;
        text = String(text);
        const attr = make1d(text.length, {
            fill: this.fill(),
            stroke: this.stroke(),
        });
        this._.attr = attr;
        const box = TextEngine.boundingBox(text, this.fontFamily(), this.fontSize());
        if (this.duration() > 0 && TextEngine.fontExists(this.fontFamily())) {
            const context = new Context(this);
            context.till(0, 0);
            this.opacity(0);
            context.till(0, 1);
            this.__createTransforming({ text: this.vars.text }, { text });
            context.till(1, 1);
            this.opacity(1);
            context.recover();
        }
        this.vars.setTogether({
            text,
            width: box.width,
            height: box.height,
        });
        return this;
    },
    fontFamily(family) {
        if (arguments.length === 0) return this.vars.fontFamily;
        const box = TextEngine.boundingBox(this.text(), family, this.fontSize());
        if (this.duration() > 0 && TextEngine.fontExists(family)) {
            const context = new Context(this);
            context.till(0, 0);
            this.opacity(0);
            context.till(0, 1);
            this.__createTransforming({ family: this.fontFamily() }, { family });
            context.till(1, 1);
            this.opacity(1);
            context.recover();
        }
        this.vars.setTogether({
            fontFamily: family,
            width: box.width,
            height: box.height,
        });
        return this;
    },
    intValue() {
        return +this.text();
    },
    __subtextAttribute(subtext, attribute, operator) {
        const attr = this._.attr;
        const text = this.vars.text;
        const matched = [];
        for (let i = 0; i + subtext.length <= text.length; i++) {
            if (text.slice(i, i + text.length) === subtext) matched.push(i, i + text.length);
        }
        const update = match => {
            if (!match) return;
            const [l, r] = match;
            for (let i = l; i < r; i++)
                attr[i] = {
                    ...attr[i],
                    ...attribute,
                };
        };
        if (operator === "all") matched.forEach(update);
        else if (operator === "first") update(matched[0]);
        else if (operator === "last") update(matched[matched.length - 1]);
        else update(matched[operator]);
        if (this.duration() > 0 && TextEngine.fontExists(this.vars.family)) {
            const context = new Context(this);
            context.till(0, 0);
            this.opacity(0);
            context.till(0, 1);
            this.__createTransforming({ attr: this._.attr }, { attr });
            context.till(1, 1);
            this.opacity(1);
            context.recover();
        }
        this._.attr = attr;
        this.vars.html = parseToHTML.call(this);
        return this;
    },
    __flushTransformings() {
        if (this._.frame !== window.CURRENT_FRAME) {
            this._.frame = window.CURRENT_FRAME;
            this._.transformings = [];
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
    __createTransforming(source, target) {
        this.__flushTransformings();
        const config = config => {
            return {
                text: config.text || this.text(),
                size: config.size || this.fontSize(),
                attr: config.attr || this._.attr,
                family: config.family || this.vars.family,
                x: config.x || this.x(),
                y: config.y || this.y(),
            };
        };
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) {
            if (transforming.l === l && transforming.r === r) {
                transforming.replayByText(config(target));
                return;
            }
        }
        this._.transformings.push(TextEngine.transformText(this, config(source), config(target)));
    },
});

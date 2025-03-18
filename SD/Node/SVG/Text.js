import { Interp } from "@/Animate/Interp";
import { svg } from "@/Interact/Root";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

let globalText = undefined;

function createText() {
    if (globalText === undefined) {
        globalText = svg().append("text");
        globalText.setAttribute("fill-opacity", 0);
        globalText.setAttribute("stroke-opacity", 0);
        globalText.setAttribute("font-family", "consolas");
    }
}

function widthToFontSize(text, width) {
    createText();
    globalText.setAttribute("text", text);
    globalText.setAttribute("font-size", 20);
    const box = globalText.nake().getBBox();
    return (width / box.width) * 20;
}

function heightToFontSize(text, height) {
    createText();
    globalText.setAttribute("text", text);
    globalText.setAttribute("font-size", 20);
    const box = globalText.nake().getBBox();
    return (height / box.height) * 20;
}

function fontSizeToBox(text, fontSize) {
    createText();
    globalText.setAttribute("text", text);
    globalText.setAttribute("font-size", fontSize);
    return globalText.nake().getBBox();
}

function parseText(text) {
    let ans = "";
    text = String(text);
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") ans += "&emsp;";
        else if (text[i] === "<") ans += "&lt;";
        else if (text[i] === ">") ans += "&gt;";
        else ans += text[i];
    }
    return ans;
}

export function Text(target, text = "") {
    BaseSVG.call(this, target, "text");

    this.type("Text");

    this.vars.fill = C.black;
    this.vars.strokeWidth = 0;
    this.vars.merge({
        x: 0,
        y: 0,
        text: "",
        fontSize: 20,
        width: 0,
        height: 0,
    });

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("text", Factory.action(this, this._.nake, "text", Interp.stringInterp));
    this.vars.associate("fontSize", Factory.action(this, this._.nake, "font-size", Interp.numberInterp));

    this._.nake.setAttribute("text-anchor", "start");
    this._.nake.setAttribute("dy", ".92em");
    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("font-size", this.vars.fontSize);
    this._.nake.setAttribute("font-family", "consolas");

    if (text !== undefined && text !== null) this.text(text);
}

Text.prototype = {
    ...BaseSVG.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    fontSize(fontSize) {
        if (fontSize == undefined) return this.vars.fontSize;
        if (this.vars.fontSize > 1e-1) {
            const k = fontSize / this.vars.fontSize;
            this.vars.width *= k;
            this.vars.height *= k;
        } else {
            const box = fontSizeToBox(this.vars.text, fontSize);
            this.vars.width = box.width;
            this.vars.height = box.height;
        }
        this.vars.fontSize = fontSize;
        return this;
    },
    width(width) {
        if (width === undefined) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = widthToFontSize(this.vars.text, width);
            this.fontSize(fontSize);
        }
        return this;
    },
    height(height) {
        if (height === undefined) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = heightToFontSize(this.vars.text, height);
            this.fontSize(fontSize);
        }
        return this;
    },
    text(text) {
        if (text === undefined) return this.vars.text;
        const parsedText = parseText(String(text));
        this.vars.text = parsedText === "" ? parseText(" ") : parsedText;
        const box = fontSizeToBox(this.vars.text, this.vars.fontSize);
        // TODO: 支持 vars 级别的 freeze/unfreeze
        if (this.rule()) this.rule().freeze();
        this.vars.width = box.width;
        this.vars.height = box.height;
        if (this.rule()) this.rule().unfreeze();
        return this;
    },
    intValue() {
        return +this.text();
    },
};

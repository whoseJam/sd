import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { buildAnimation } from "@/Node/Text/TextEngine/Animation";
import { transformProcess, transformPostProcess } from "@/Node/Text/TextEngine/Transform";
import { typewritterProcess, typewritterPostProcess } from "@/Node/Text/TextEngine/Typewritter";
import { SDColor } from "@/Utility/Color";
import { matchSubtext } from "@/Node/Text/TextEngine/Mapping";
import { createTextView, PathStyle } from "@/Node/Text/TextEngine/TextView";
import { Color as C } from "@/Utility/Color";
import { FontManager } from "@/Node/Text/TextEngine/Opentype";
import { Group } from "@/Node/Other/Group";
import { Interp } from "@/Animate/Interp";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { TransformOrigin } from "../SDNode";

export class Text extends BaseText {
    _: BaseText["_"] & {
        text: string;
        html: string;
        width: number;
        height: number;
        fontSize: number;
        fontFamily: string;
        subtextStyles: Array<PathStyle>;
    };

    constructor(args?: {
        targetNode?: Group;
        x?: number;
        y?: number;
        cx?: number;
        cy?: number;
        centerX?: number;
        centerY?: number;
        fontSize?: number;
        fontWeight?: number | string;
        fontFamily?: string;
        text?: string;
        transformOrigin?: TransformOrigin;
        translate?: [number, number];
        rotate?: number;
        scale?: [number, number];
        opacity?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: string | number | Array<number>;
        strokeLineCap?: StrokeLineCap;
        strokeLineJoin?: StrokeLineJoin;
        filter?: SDFilter;
    }) {
        super();

        this.renderer = this.createSVGNode("text", {
            "text": args?.text ?? "",
            "x": args?.x ?? 0,
            "y": args?.y ?? 0,
            "fontSize": args?.fontSize ?? 20,
            "fontWeight": args?.fontWeight,
            "fontFamily": args?.fontFamily ?? "Times New Roman",
            "transformOrigin": args?.transformOrigin ?? ["center", "center"],
            "translate": args?.translate ?? [0, 0],
            "rotate": args?.rotate ?? 0,
            "scale": args?.scale ?? [1, 1],
            "opacity": args?.opacity ?? 1,
            "fill": args?.fill ?? C.black,
            "fillOpacity": args?.fillOpacity ?? 1,
            "stroke": args?.stroke ?? C.black,
            "strokeOpacity": args?.strokeOpacity ?? 1,
            "strokeWidth": args?.strokeWidth ?? 0,
            "strokeDashOffset": args?.strokeDashOffset ?? 0,
            "strokeDashArray": SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
            "strokeLineCap": args?.strokeLineCap ?? "butt",
            "strokeLineJoin": args?.strokeLineJoin ?? "miter",
            "filter": Filter.toURLString(args?.filter),
            "text-anchor": "start",
            "dominant-baseline": "text-before-edge",
        });

        const styles = generateDefaultStyles(this.getText());
        const box = FontManager.boundingBox(this.getText(), this.getFontFamily(), this.getFontSize());
        Object.assign(this._, {
            subtextStyles: styles,
            html: parseToHTML(styles, this.getText()),
            width: box.width,
            height: box.height,
        });

        if (args?.cx !== undefined) this.setCx(args.cx);
        if (args?.cy !== undefined) this.setCy(args.cy);
        if (args?.centerX !== undefined) this.setCenterX(args.centerX);
        if (args?.centerY !== undefined) this.setCenterY(args.centerY);

        args?.targetNode?.appendChild(this);
    }

    getFontSize(): number {
        return this._.fontSize;
    }

    setFontSize(size: number): this {
        if (this.getFontSize() > 1e-1) {
            const k = size / this.getFontSize();
            this._.width *= k;
            this._.height *= k;
        } else {
            const box = FontManager.boundingBox(this);
            this._.width = box.width;
            this._.height = box.height;
        }
        return this.triggerAttributeChanged(this.renderer, "fontSize", size, this._.fontSize, Interp.numberInterp);
    }

    onFontSizeChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("fontSize", listener);
    }

    offFontSizeChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("fontSize", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    getHeight(): number {
        return this._.height;
    }

    getText(): string {
        return this._.text;
    }

    setText(text: string | number, mapping?: TextMapping): this {
        const text_ = String(text);
        if (this.getText() === text_) return this;
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        const styles = buildAnimation(
            this,
            { text: this.getText(), styles: this._.subtextStyles },
            { text: text_ },
            transformProcess(mapping),
            transformPostProcess(this, this.parent.getRootRenderNode()),
            "transform"
        );
        const html = parseToHTML(styles, text_);
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "text", text_, this._.text, Interp.emptyInterp);
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this.renderer, "html", html, this._.html, Interp.stringBlankInMiddleInterp);
        return this;
    }

    onTextChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("text", listener);
    }

    offTextChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("text", listener);
    }

    getFontFamily() {
        return this._.fontFamily;
    }

    setFontFamily(family: string) {
        if (family !== "Times New Roman" && family !== "Arial")
            throw new Error(`Font family ${family} is not supported in all platform`);
        const box = FontManager.boundingBox(this._.text, family, this.getFontSize());
        const styles = buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.parent.getRootRenderNode()),
            "*"
        );
        const html = parseToHTML(styles, this.getText());
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this.renderer, "html", html, this._.html, Interp.stringBlankInMiddleInterp);
        this.triggerAttributeChanged(this.renderer, "fontFamily", family, this._.fontFamily, Interp.stringInterp);
        return this;
    }

    onFontFamilyChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("fontFamily", listener);
    }

    offFontFamilyChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("fontFamily", listener);
    }

    typewritter(text: string | number) {
        const text_ = String(text);
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        const styles = buildAnimation(
            this,
            { text: this.getText(), styles: this._.subtextStyles },
            { text: text_ },
            typewritterProcess(),
            typewritterPostProcess(this, this.parent.getRootRenderNode()),
            "typewritter"
        );
        const html = parseToHTML(styles, text_);
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "text", text_, this._.text, Interp.emptyInterp);
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this.renderer, "html", html, this._.html, Interp.stringBlankInMiddleInterp);
        return this;
    }

    setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].fill = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStroke(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].stroke = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStrokeWidth(subtext: string | number, width: number, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].strokeWidth = width));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }
}

function generateDefaultStyles(text: string): Array<PathStyle> {
    const styles: Array<PathStyle> = [];
    if (!text) return styles;
    for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
    return styles;
}

function parseToHTML(styles: Array<PathStyle>, text: string) {
    const parseText = (text_: string | number) => {
        let ans = "";
        const text = String(text_);
        for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") ans += " ";
            else if (text[i] === "<") ans += "&lt;";
            else if (text[i] === ">") ans += "&gt;";
            else ans += text[i];
        }
        return ans;
    };
    let html = "";
    if (styles.length === text.length) {
        for (let l = 0, r = 0; l < text.length; l = r + 1) {
            r = l;
            while (r + 1 < text.length && styles[l].equalTo(styles[r + 1])) r++;
            if (l === 0 && r === text.length - 1 && styles[l].fill === "default" && styles[l].stroke === "default") {
                html = html + text;
                break;
            }
            let attribute = "";
            if (styles[l].fill !== "default") attribute = attribute + ` fill='${styles[l].fill}'`;
            if (styles[l].stroke !== "default") attribute = attribute + ` stroke='${styles[l].stroke}'`;
            if (styles[l].strokeWidth !== "default") attribute = attribute + ` stroke-width='${styles[l].strokeWidth}'`;
            html = html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
            html = html + parseText(text.slice(l, r + 1));
            html = html + "</tspan>";
        }
    } else html = parseText(text);
    return html;
}

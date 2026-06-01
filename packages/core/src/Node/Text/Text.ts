import type { SDFilter } from "@/Node/Filter/Filter";
import type { Group } from "@/Node/Other/Group";
import type { StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import type { BaseTextAttributes, TextMapping } from "@/Node/Text/BaseText";
import type { SDColor } from "@/Utility/Color";

import { Interp } from "@/Animate/Interp";
import { Filter } from "@/Node/Filter/Filter";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { BaseText } from "@/Node/Text/BaseText";
import { buildAnimation } from "@/Node/Text/TextEngine/Animation";
import { matchSubtext } from "@/Node/Text/TextEngine/Mapping";
import { FontManager } from "@/Node/Text/TextEngine/Opentype";
import { createTextView, PathStyle } from "@/Node/Text/TextEngine/TextView";
import {
  transformProcess,
  transformPostProcess,
} from "@/Node/Text/TextEngine/Transform";
import {
  typewritterProcess,
  typewritterPostProcess,
} from "@/Node/Text/TextEngine/Typewritter";
import { Color as C } from "@/Utility/Color";

import type { TransformOrigin } from "../SDNode";

export type TextAttributes = BaseTextAttributes & {
  text: string;
  html: string;
  fontSize: number;
  fontFamily: string;
  subtextStyles: Array<PathStyle>;
};

// width / height are caches recomputed from FontManager.boundingBox after
// any text / fontFamily / fontSize change, so they stay as direct fields.
export class Text extends BaseText {
  declare attributes: TextAttributes;
  protected width: number = 0;
  protected height: number = 0;

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

    const text = args?.text ?? "";
    const fontFamily = args?.fontFamily ?? "Times New Roman";
    const fontSize = args?.fontSize ?? 20;
    const styles = generateDefaultStyles(text);
    const box = FontManager.boundingBox(text, fontFamily, fontSize);

    this.attributes = {
      ...this.attributes,
      transformOrigin: args?.transformOrigin ?? ["center", "center"],
      translate: args?.translate ?? [0, 0],
      rotate: args?.rotate ?? 0,
      scale: args?.scale ?? [1, 1],
      opacity: args?.opacity ?? 1,
      fill: C.toRGBA(C.toFill(args?.fill ?? C.black)),
      stroke: C.toRGBA(C.toStroke(args?.stroke ?? C.black)),
      fillOpacity: args?.fillOpacity ?? 1,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 0,
      strokeDashOffset: args?.strokeDashOffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      text,
      fontFamily,
      fontSize,
      subtextStyles: styles,
      html: parseToHTML(styles, text),
    };
    this.width = box.width;
    this.height = box.height;

    this.renderer = this.createSVGNode("text", {
      fontWeight: args?.fontWeight,
      filter: Filter.toURLString(args?.filter),
      "text-anchor": "start",
      "dominant-baseline": "text-before-edge",
    });
    this.refreshY();

    if (args?.cx !== undefined) this.setCx(args.cx);
    if (args?.cy !== undefined) this.setCy(args.cy);
    if (args?.centerX !== undefined) this.setCenterX(args.centerX);
    if (args?.centerY !== undefined) this.setCenterY(args.centerY);

    args?.targetNode?.appendChild(this);
  }

  get fontSize(): number {
    return this.attributes.fontSize;
  }

  set fontSize(v: number) {
    this.setFontSize(v);
  }

  getFontSize(): number {
    return this.fontSize;
  }

  setFontSize(size: number): this {
    if (this.attributes.fontSize > 1e-1) {
      const k = size / this.attributes.fontSize;
      this.width *= k;
      this.height *= k;
    } else {
      const box = FontManager.boundingBox(this);
      this.width = box.width;
      this.height = box.height;
    }
    this.refreshY();
    this.triggerAttributeChanged(
      this.renderer,
      "fontSize",
      size,
      this.attributes.fontSize,
      Interp.numberInterp,
    );
    return this;
  }

  onFontSizeChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("fontSize", listener);
  }

  offFontSizeChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("fontSize", listener);
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  get text(): string {
    return this.attributes.text;
  }

  set text(v: string) {
    this.setText(v);
  }

  getText(): string {
    return this.text;
  }

  setText(text: string | number, mapping?: TextMapping): this {
    const text_ = String(text);
    if (this.attributes.text === text_) return this;
    const box = FontManager.boundingBox(
      text_,
      this.attributes.fontFamily,
      this.attributes.fontSize,
    );
    const styles = buildAnimation(
      this,
      { text: this.attributes.text, styles: this.attributes.subtextStyles },
      { text: text_ },
      transformProcess(mapping),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "transform",
    );
    const html = parseToHTML(styles, text_);
    this.width = box.width;
    this.height = box.height;
    this.refreshY();
    this.triggerAttributeChanged(
      undefined,
      "text",
      text_,
      this.attributes.text,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      styles,
      this.attributes.subtextStyles,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "html",
      html,
      this.attributes.html,
      Interp.stringBlankInMiddleInterp,
    );
    return this;
  }

  onTextChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("text", listener);
  }

  offTextChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("text", listener);
  }

  get fontFamily(): string {
    return this.attributes.fontFamily;
  }

  set fontFamily(v: string) {
    this.setFontFamily(v);
  }

  getFontFamily() {
    return this.fontFamily;
  }

  setFontFamily(family: string): this {
    if (family !== "Times New Roman" && family !== "Arial")
      throw new Error(`Font family ${family} is not supported in all platform`);
    const box = FontManager.boundingBox(
      this.attributes.text,
      family,
      this.attributes.fontSize,
    );
    const styles = buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "*",
    );
    const html = parseToHTML(styles, this.attributes.text);
    this.width = box.width;
    this.height = box.height;
    this.refreshY();
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      styles,
      this.attributes.subtextStyles,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "html",
      html,
      this.attributes.html,
      Interp.stringBlankInMiddleInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "fontFamily",
      family,
      this.attributes.fontFamily,
      Interp.stringInterp,
    );
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
    const box = FontManager.boundingBox(
      text_,
      this.attributes.fontFamily,
      this.attributes.fontSize,
    );
    const styles = buildAnimation(
      this,
      { text: this.attributes.text, styles: this.attributes.subtextStyles },
      { text: text_ },
      typewritterProcess(),
      typewritterPostProcess(this, this.parent.getRootRenderNode()),
      "typewritter",
    );
    const html = parseToHTML(styles, text_);
    this.width = box.width;
    this.height = box.height;
    this.refreshY();
    this.triggerAttributeChanged(
      undefined,
      "text",
      text_,
      this.attributes.text,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      styles,
      this.attributes.subtextStyles,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "html",
      html,
      this.attributes.html,
      Interp.stringBlankInMiddleInterp,
    );
    return this;
  }

  setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
    const textView = createTextView(this.attributes.text, {});
    const subtextView = matchSubtext(textView, String(subtext));
    const newStyles = this.attributes.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.__iterate((i) => (newStyles[i].fill = color));
    buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "*",
    );
    this.attributes.subtextStyles = newStyles;
    this.attributes.html = parseToHTML.call(this);
    return this;
  }

  setSubtextStroke(subtext: string | number, color: SDColor, i: number = 0) {
    const textView = createTextView(this.attributes.text, {});
    const subtextView = matchSubtext(textView, String(subtext));
    const newStyles = this.attributes.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.__iterate((i) => (newStyles[i].stroke = color));
    buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "*",
    );
    this.attributes.subtextStyles = newStyles;
    this.attributes.html = parseToHTML.call(this);
    return this;
  }

  setSubtextStrokeWidth(
    subtext: string | number,
    width: number,
    i: number = 0,
  ) {
    const textView = createTextView(this.attributes.text, {});
    const subtextView = matchSubtext(textView, String(subtext));
    const newStyles = this.attributes.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.__iterate((i) => (newStyles[i].strokeWidth = width));
    buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "*",
    );
    this.attributes.subtextStyles = newStyles;
    this.attributes.html = parseToHTML.call(this);
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
      if (
        l === 0 &&
        r === text.length - 1 &&
        styles[l].fill === "default" &&
        styles[l].stroke === "default"
      ) {
        html = html + text;
        break;
      }
      let attribute = "";
      if (styles[l].fill !== "default")
        attribute = attribute + ` fill='${styles[l].fill}'`;
      if (styles[l].stroke !== "default")
        attribute = attribute + ` stroke='${styles[l].stroke}'`;
      if (styles[l].strokeWidth !== "default")
        attribute = attribute + ` stroke-width='${styles[l].strokeWidth}'`;
      html =
        html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
      html = html + parseText(text.slice(l, r + 1));
      html = html + "</tspan>";
    }
  } else html = parseText(text);
  return html;
}

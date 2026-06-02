import type { SDFilter } from "@/node/filter/filter";
import type { Group } from "@/node/other/group";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { BaseTextAttributes, TextMapping } from "@/node/text/base-text";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Filter } from "@/node/filter/filter";
import { SDSVGNode } from "@/node/svg-node";
import { BaseText } from "@/node/text/base-text";
import { buildAnimation } from "@/node/text/text-engine/animation";
import { matchSubtext } from "@/node/text/text-engine/mapping";
import { FontManager } from "@/node/text/text-engine/opentype";
import { createTextView, PathStyle } from "@/node/text/text-engine/text-view";
import {
  transformProcess,
  transformPostProcess,
} from "@/node/text/text-engine/transform";
import { Color as C } from "@/utility/color";

import type { TransformOrigin } from "../node";

export type TextAttributes = BaseTextAttributes & {
  text: string;
  html: string;
  fontFamily: string;
  subtextStyles: Array<PathStyle>;
};

export class Text extends BaseText {
  declare attributes: TextAttributes;

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
      width: box.width,
      height: box.height,
      text,
      fontFamily,
      fontSize,
      subtextStyles: styles,
      html: parseToHTML(styles, text),
    };

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
    let newWidth: number;
    let newHeight: number;
    if (this.attributes.fontSize > 1e-1) {
      const k = size / this.attributes.fontSize;
      newWidth = this.attributes.width * k;
      newHeight = this.attributes.height * k;
    } else {
      const box = FontManager.boundingBox(this);
      newWidth = box.width;
      newHeight = box.height;
    }
    this.triggerSizeChange(newWidth, newHeight);
    this.triggerAttributeChanged(
      this.renderer,
      "fontSize",
      size,
      this.attributes.fontSize,
      Interp.numberInterp,
    );
    return this;
  }

  // Order: width, then height, then a y re-fire with source == target.
  // Each tick updates attributes.{width,height} via the BaseText
  // renderAttribute override; the trailing y re-fire reads the freshly-
  // updated attributes.height to recompute DOM y so the (x,y) anchor
  // stays put through the tween.
  private triggerSizeChange(newWidth: number, newHeight: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "width",
      newWidth,
      this.attributes.width,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "height",
      newHeight,
      this.attributes.height,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "y",
      this.attributes.y,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  onFontSizeChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("fontSize", listener);
  }

  offFontSizeChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("fontSize", listener);
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

  setText(value: string | number, mapping?: TextMapping): this {
    const text = String(value);
    if (this.attributes.text === text) return this;
    const box = FontManager.boundingBox(
      text,
      this.attributes.fontFamily,
      this.attributes.fontSize,
    );
    const styles = buildAnimation(
      this,
      { text: this.attributes.text, styles: this.attributes.subtextStyles },
      { text },
      transformProcess(mapping),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "transform",
    );
    const html = parseToHTML(styles, text);
    this.triggerSizeChange(box.width, box.height);
    this.triggerAttributeChanged(
      undefined,
      "text",
      text,
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
    this.triggerSizeChange(box.width, box.height);
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

  setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
    return this.applySubtextStyle(subtext, i, (style) => (style.fill = color));
  }

  setSubtextStroke(subtext: string | number, color: SDColor, i: number = 0) {
    return this.applySubtextStyle(
      subtext,
      i,
      (style) => (style.stroke = color),
    );
  }

  setSubtextStrokeWidth(
    subtext: string | number,
    width: number,
    i: number = 0,
  ) {
    return this.applySubtextStyle(
      subtext,
      i,
      (style) => (style.strokeWidth = width),
    );
  }

  private applySubtextStyle(
    subtext: string | number,
    occurrence: number,
    mutate: (style: PathStyle) => void,
  ) {
    const textView = createTextView(this.attributes.text, {});
    const subtextView = matchSubtext(textView, String(subtext), occurrence);
    const newStyles = this.attributes.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.iterate((j) => mutate(newStyles[j]));
    buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.parent.getRootRenderNode()),
      "*",
    );
    const html = parseToHTML(newStyles, this.attributes.text);
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      newStyles,
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
}

function generateDefaultStyles(text: string): Array<PathStyle> {
  const styles: Array<PathStyle> = [];
  if (!text) return styles;
  for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
  return styles;
}

function parseToHTML(styles: Array<PathStyle>, text: string) {
  const escape = (chunk: string) => {
    let ans = "";
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === " ") ans += " ";
      else if (chunk[i] === "<") ans += "&lt;";
      else if (chunk[i] === ">") ans += "&gt;";
      else ans += chunk[i];
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
      html = html + escape(text.slice(l, r + 1));
      html = html + "</tspan>";
    }
  } else html = escape(text);
  return html;
}

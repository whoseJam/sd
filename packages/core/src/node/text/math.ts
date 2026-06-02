import type { Group } from "@/node/other/group";
import type { BaseTextAttributes, TextMapping } from "@/node/text/base-text";
import type { SDAllColor, SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { SDSVGNode } from "@/node/svg-node";
import { BaseText } from "@/node/text/base-text";
import { buildAnimation } from "@/node/text/text-engine/animation";
import { matchSubtext } from "@/node/text/text-engine/mapping";
import { MathManager } from "@/node/text/text-engine/mathjax";
import { PathStyle, createTextView } from "@/node/text/text-engine/text-view";
import {
  transformPostProcess,
  transformProcess,
} from "@/node/text/text-engine/transform";
import { RenderNode } from "@/renderer/render-node";
import { Color as C } from "@/utility/color";

export type MathAttributes = BaseTextAttributes & {
  string: string;
  text: Array<string>;
  html: RenderNode | undefined;
  subtextStyles: Array<PathStyle>;
};

export class Math extends BaseText {
  declare attributes: MathAttributes;

  constructor(args?: {
    targetNode?: Group;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    centerX?: number;
    centerY?: number;
    fontSize?: number;
    text?: string;
    opacity?: number;
    fill?: SDColor;
    stroke?: SDColor;
    strokeWidth?: number;
    strokeDashOffset?: number;
    strokeDashArray?: number | Array<number>;
  }) {
    super();

    const string = args?.text ?? "";

    this.attributes = {
      ...this.attributes,
      opacity: args?.opacity ?? 1,
      fill: C.toRGBA(C.toFill(args?.fill ?? C.black)),
      stroke: C.toRGBA(C.toStroke(args?.stroke ?? C.black)),
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      width: 0,
      height: 0,
      string,
      text: [],
      html: undefined,
      fontSize: args?.fontSize ?? 20,
      subtextStyles: [],
    };

    this.renderer = this.createSVGNode("g");

    if (string !== "") {
      const [html, text, styles] = parseToHTML(this, string);
      const box = MathManager.boundingBox(this.attributes.y, html);
      this.getRootRenderNode().__append(html);
      this.attributes.text = text;
      this.attributes.subtextStyles = styles;
      this.attributes.html = html;
      this.attributes.width = box.width;
      this.attributes.height = box.height;
      this.refreshY(html);
    }

    if (args?.cx !== undefined) this.setCx(args.cx);
    if (args?.cy !== undefined) this.setCy(args.cy);
    if (args?.centerX !== undefined) this.setCenterX(args.centerX);
    if (args?.centerY !== undefined) this.setCenterY(args.centerY);

    args?.targetNode?.appendChild(this);
  }

  // Math overrides x / y / fill / stroke to write to the inner math
  // RenderNode (this.attributes.html) rather than the outer <g>, because
  // MathJax positions the glyphs on the inner element.
  setX(x: number): this {
    this.triggerAttributeChanged(
      this.attributes.html,
      "x",
      x,
      this.attributes.x,
      Interp.numberInterp,
    );
    return this;
  }

  setY(y: number): this {
    this.triggerAttributeChanged(
      this.attributes.html,
      "y",
      y,
      this.attributes.y,
      Interp.numberInterp,
    );
    return this;
  }

  setFill(fill: SDAllColor): this {
    this.fill = C.toRGBA(C.toFill(fill));
    return this;
  }

  setStroke(stroke: SDAllColor): this {
    this.stroke = C.toRGBA(C.toStroke(stroke));
    return this;
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
      const box = MathManager.boundingBox(
        this.attributes.y,
        this.attributes.html,
      );
      newWidth = box.width;
      newHeight = box.height;
    }
    this.triggerSizeChange(newWidth, newHeight);
    this.triggerAttributeChanged(
      this.attributes.html,
      "fontSize",
      size,
      this.attributes.fontSize,
      Interp.numberInterp,
    );
    return this;
  }

  // Same shape as Text.triggerSizeChange — see that comment for the
  // ordering rationale.
  private triggerSizeChange(newWidth: number, newHeight: number) {
    this.triggerAttributeChanged(
      this.attributes.html,
      "width",
      newWidth,
      this.attributes.width,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      this.attributes.html,
      "height",
      newHeight,
      this.attributes.height,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      this.attributes.html,
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

  get text(): Array<string> {
    return this.attributes.text;
  }

  getText(): string {
    return this.attributes.string;
  }

  setText(value: string | number, mapping?: TextMapping): this {
    const latex = String(value);
    if (this.attributes.string === latex) return this;
    const [html, glyphs] = parseToHTML(this, latex);
    const box = MathManager.boundingBox(this.attributes.y, html);
    const styles = buildAnimation(
      this,
      { text: this.attributes.text, styles: this.attributes.subtextStyles },
      { text: glyphs },
      transformProcess(mapping),
      transformPostProcess(this, this.getRootRenderNode()),
      "transform",
    );
    MathManager.applyStyles(html, styles);
    this.triggerSizeChange(box.width, box.height);
    this.refreshY(html);
    this.triggerAttributeChanged(
      undefined,
      "string",
      latex,
      this.attributes.string,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      undefined,
      "text",
      glyphs,
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
      Interp.childBlankInMiddleInterp,
    );
    return this;
  }

  onTextChanged(listener: (vn: string, vo: string) => void): this {
    return this.onAttributeChanged("string", listener);
  }

  offTextChanged(listener: (vn: string, vo: string) => void): this {
    return this.offAttributeChanged("string", listener);
  }

  setSubtextFill(
    subtext: string | number,
    color: SDColor,
    i: number = 0,
  ): this {
    const textView = createTextView(this.attributes.text, {});
    const text = parseToHTML(this, String(subtext))[1];
    const subtextView = matchSubtext(textView, text, i);
    const newStyles = this.attributes.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.iterate((i) => (newStyles[i].fill = color));
    buildAnimation(
      this,
      { text: this.attributes.text },
      { text: this.attributes.text },
      transformProcess([]),
      transformPostProcess(this, this.getRootRenderNode()),
      "*",
    );
    const html = parseToHTML(this, this.attributes.string, newStyles)[0];
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
      Interp.childBlankInMiddleInterp,
    );
    return this;
  }
}

function parseToHTML(
  node: Math,
  string: string,
  styles?: Array<PathStyle>,
): [RenderNode, Array<string>, Array<PathStyle>] {
  // @ts-ignore
  const element = MathJax.tex2svg(string).children[0] as SVGSVGElement;
  element.children[1].removeAttribute("fill");
  element.children[1].removeAttribute("stroke");
  element.children[1].removeAttribute("stroke-width");
  const math = RenderNode.createMathRenderNode(
    node,
    node.getRootRenderNode(),
    element,
  );
  math.setAttribute("fill", node.getFill());
  math.setAttribute("stroke", node.getStroke());
  math.setAttribute("x", node.getLocalX());
  math.setAttribute("y", node.getLocalY());
  math.setAttribute("fontSize", node.getFontSize());
  const text = MathManager.getMathText(math);
  if (styles === undefined) {
    styles = [];
    for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
  }
  MathManager.applyStyles(math, styles);
  return [math, text, styles];
}

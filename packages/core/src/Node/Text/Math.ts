import type { TextMapping } from "@/Node/Text/BaseText";
import { BaseText } from "@/Node/Text/BaseText";
import type { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";
import { PathStyle, createTextView } from "@/Node/Text/TextEngine/TextView";
import { MathManager } from "@/Node/Text/TextEngine/Mathjax";
import { buildAnimation } from "@/Node/Text/TextEngine/Animation";
import {
  transformPostProcess,
  transformProcess,
} from "@/Node/Text/TextEngine/Transform";
import { Interp } from "@/Animate/Interp";
import type { SDAllColor, SDColor } from "@/Utility/Color";
import { Color as C } from "@/Utility/Color";
import { matchSubtext } from "@/Node/Text/TextEngine/Mapping";

export class Math extends BaseText {
  protected string: string = "";
  protected text: Array<string> = [];
  html: RenderNode | undefined = undefined;
  protected width: number = 0;
  protected height: number = 0;
  protected fontSize: number = 20;
  protected subtextStyles: Array<PathStyle> = [];

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

    this.renderer = this.createSVGNode("g", {
      fill: args?.fill ?? C.black,
      stroke: args?.stroke ?? C.black,
    });

    this.x = args?.x ?? 0;
    this.y = args?.y ?? 0;
    this.opacity = args?.opacity ?? 1;
    this.string = args?.text ?? "";
    this.fontSize = args?.fontSize ?? 20;
    this.strokeWidth = args?.strokeWidth ?? 1;
    this.strokeDashOffset = args?.strokeDashOffset ?? 0;
    this.strokeDashArray = (typeof args?.strokeDashArray === "number"
      ? [args.strokeDashArray]
      : args?.strokeDashArray) ?? [1, 0];

    if (this.getText() !== "") {
      const [html, text, styles] = parseToHTML(this, this.getText());
      const box = MathManager.boundingBox(this.getY(), html);
      this.getRootRenderNode().__append(html);
      this.text = text;
      this.subtextStyles = styles;
      this.html = html;
      this.width = box.width;
      this.height = box.height;
      this.refreshY(this.html);
    }

    if (args?.cx !== undefined) this.setCx(args.cx);
    if (args?.cy !== undefined) this.setCy(args.cy);
    if (args?.centerX !== undefined) this.setCenterX(args.centerX);
    if (args?.centerY !== undefined) this.setCenterY(args.centerY);

    args?.targetNode?.appendChild(this);
  }

  setX(x: number): this {
    return this.triggerAttributeChanged(
      this.html,
      "x",
      x,
      this.x,
      Interp.numberInterp,
    );
  }

  setY(y: number): this {
    return this.triggerAttributeChanged(
      this.html,
      "y",
      y,
      this.y,
      Interp.numberInterp,
    );
  }

  setFill(fill: SDAllColor) {
    return this.triggerAttributeChanged(
      this.html,
      "fill",
      fill,
      this.getFill(),
      Interp.colorInterp,
    );
  }

  setStroke(stroke: SDAllColor) {
    return this.triggerAttributeChanged(
      this.html,
      "stroke",
      stroke,
      this.getStroke(),
      Interp.colorInterp,
    );
  }

  getFontSize(): number {
    return this.fontSize;
  }

  setFontSize(size: number): this {
    if (this.getFontSize() > 1e-1) {
      const k = size / this.getFontSize();
      this.width *= k;
      this.height *= k;
    } else {
      const box = MathManager.boundingBox(this.getY(), this.html);
      this.width = box.width;
      this.height = box.height;
    }
    this.refreshY(this.html);
    return this.triggerAttributeChanged(
      this.html,
      "fontSize",
      size,
      this.fontSize,
      Interp.numberInterp,
    );
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

  getText(): string {
    return this.string;
  }

  setText(text: string | number, mapping?: TextMapping): this {
    if (this.getText() === String(text)) return this;
    const [html, text_, _] = parseToHTML(this, String(text));
    const box = MathManager.boundingBox(this.getY(), html);
    const styles = buildAnimation(
      this,
      { text: this.text, styles: this.subtextStyles },
      { text: text_ },
      transformProcess(mapping),
      transformPostProcess(this, this.getRootRenderNode()),
      "transform",
    );
    MathManager.applyStyles(html, styles);
    this.width = box.width;
    this.height = box.height;
    this.refreshY(html);
    this.triggerAttributeChanged(
      undefined,
      "string",
      String(text),
      this.string,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      undefined,
      "text",
      text_,
      this.text,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      styles,
      this.subtextStyles,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "html",
      html,
      this.html,
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
    const textView = createTextView(this.text, {});
    const text = parseToHTML(this, String(subtext))[1];
    const subtextView = matchSubtext(textView, text);
    const newStyles = this.subtextStyles.map((style: PathStyle) =>
      style.clone(),
    );
    subtextView.__iterate((i) => (newStyles[i].fill = color));
    buildAnimation(
      this,
      { text: this.text },
      { text: this.text },
      transformProcess([]),
      transformPostProcess(this, this.getRootRenderNode()),
      "*",
    );
    const html = parseToHTML(this, this.string, newStyles)[0];
    this.triggerAttributeChanged(
      undefined,
      "subtextStyles",
      newStyles,
      this.subtextStyles,
      Interp.emptyInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "html",
      html,
      this.html,
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
  math.setAttribute("x", node.getX());
  math.setAttribute("y", node.getY());
  math.setAttribute("fontSize", node.getFontSize());
  const text = MathManager.getMathText(math);
  if (styles === undefined) {
    styles = [];
    for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
  }
  MathManager.applyStyles(math, styles);
  return [math, text, styles];
}

import type { BaseText } from "@/Node/Text/BaseText";
import type { Text } from "@/Node/Text/Text";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { SDColor } from "@/Utility/Color";

import { Animate as A } from "@/Animate/Animate";

type SDColorOrDefault = SDColor | "default";
type NumberOrDefault = number | "default";
type NumberArrayOrDefault = Array<number> | "default";

export class PathStyle {
  fill: SDColorOrDefault;
  stroke: SDColorOrDefault;
  strokeWidth: NumberOrDefault;
  strokeDashArray: NumberArrayOrDefault;
  constructor(args: {
    fill?: SDColorOrDefault;
    stroke?: SDColorOrDefault;
    strokeWidth?: NumberOrDefault;
    strokeDashArray?: NumberArrayOrDefault;
  }) {
    this.fill = args.fill ?? "default";
    this.stroke = args.stroke ?? "default";
    this.strokeWidth = args.strokeWidth ?? "default";
    this.strokeDashArray = args.strokeDashArray ?? "default";
  }
  equalTo(style: PathStyle) {
    return (
      this.fill === style.fill &&
      this.stroke === style.stroke &&
      this.strokeWidth === style.strokeWidth &&
      this.strokeDashArray === style.strokeDashArray
    );
  }
  clone() {
    return new PathStyle({
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      strokeDashArray: this.strokeDashArray,
    });
  }
  styleAt(text: BaseText, t: number) {
    const fill =
      this.fill === "default"
        ? A.getAttribute(text, "fill", t, text.getFill())
        : this.fill;
    const stroke =
      this.stroke === "default"
        ? A.getAttribute(text, "stroke", t, text.getStroke())
        : this.stroke;
    const strokeWidth =
      this.strokeWidth === "default"
        ? A.getAttribute(text, "stroke-width", t, text.getStrokeWidth())
        : this.strokeWidth;
    const strokeDashArray =
      this.strokeDashArray === "default"
        ? A.getAttribute(text, "stroke-dasharray", t, text.getStrokeDashArray())
        : this.strokeDashArray;
    return new PathStyle({
      fill,
      stroke,
      strokeWidth,
      strokeDashArray,
    });
  }
}

export class PathView {
  d: string;
  transform: SVGMatrix;
  constructor(d: string, transform: SVGMatrix = new DOMMatrix()) {
    this.d = d;
    this.transform = transform;
  }
  clone() {
    const path = new PathView(this.d, this.transform);
    return path;
  }
}

export class TextView {
  text: string | Array<string>;
  styles?: Array<PathStyle>;
  backing?: RenderNode;
  constructor(text: string | Array<string>, styles?: Array<PathStyle>) {
    this.text = text;
    this.styles = styles;
  }
  asSubtextView() {
    return new SubtextView(this, 0, this.styles.length - 1);
  }
}

export class SubtextView {
  textView: TextView;
  l?: number;
  r?: number;
  positions?: Set<number>;
  constructor(textView: TextView, positions: Set<number>);
  constructor(textView: TextView, l: number, r: number);
  constructor(textView: TextView, l: number | Set<number>, r?: number) {
    this.textView = textView;
    if (typeof l === "number") {
      this.l = l;
      this.r = r;
    } else this.positions = l;
  }
  getStyle() {
    if (!this.textView.styles) return new PathStyle({});
    if (this.__first() === undefined) return new PathStyle({});
    return this.textView.styles[this.__first()];
  }
  getStyleAt(text: Text, t: number) {
    return this.getStyle().styleAt(text, t);
  }
  setStyle(style: PathStyle) {
    if (!this.textView.styles) return;
    this.__iterate((i) => {
      this.textView.styles[i] = style;
    });
  }
  count(): number {
    let count = 0;
    this.__iterate(() => count++);
    return count;
  }
  __iterate(callback: (position: number) => void) {
    if (this.positions)
      for (const position of this.positions.values()) callback(position);
    else for (let i = this.l; i <= this.r; i++) callback(i);
  }
  __first() {
    if (this.positions) {
      const position = this.positions.values().next();
      return position.value;
    } else return this.l;
  }
}

export function createTextView(
  text: string | Array<string>,
  args: { styles?: Array<PathStyle> },
) {
  const styles = [];
  for (let i = 0; i < text.length; i++) {
    if (args.styles) styles.push(args.styles[i]);
    else styles.push(new PathStyle({}));
  }
  return new TextView(text, styles);
}

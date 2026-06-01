import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import type { Group } from "@/Node/Other/Group";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { SDNodeAttributes } from "@/Node/SDNode";

export type ImageAttributes = SDNodeAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
};

export class Image extends BaseShape {
  declare attributes: ImageAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "y") return renderer.setAttribute("y", -(value + this.height));
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    src?: string;
    opacity?: number;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      width: args?.width ?? 40,
      height: args?.height ?? 40,
      src: args?.src ?? "",
    };

    this.renderer = this.createSVGNode("image", {
      x: this.attributes.x,
      y: this.attributes.y,
      width: this.attributes.width,
      height: this.attributes.height,
      src: this.attributes.src,
      opacity: args?.opacity ?? 1,
      preserveAspectRatio: "xMidYMid meet",
    });

    args?.targetNode?.appendChild(this.renderer);
  }

  get x(): number {
    return this.attributes.x;
  }

  set x(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "x",
      v,
      this.attributes.x,
      Interp.numberInterp,
    );
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  onXChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("x", listener);
  }

  offXChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("x", listener);
  }

  get y(): number {
    return this.attributes.y;
  }

  set y(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "y",
      v,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  onYChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("y", listener);
  }

  offYChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("y", listener);
  }

  get width(): number {
    return this.attributes.width;
  }

  set width(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "width",
      v,
      this.attributes.width,
      Interp.numberInterp,
    );
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  onWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("width", listener);
  }

  offWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("width", listener);
  }

  get height(): number {
    return this.attributes.height;
  }

  // SVG y depends on height (svg_y = -(y + height)); a height change must
  // re-fire the y attribute so renderAttribute reads the new height.
  set height(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "height",
      v,
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

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  onHeightChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("height", listener);
  }

  offHeightChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("height", listener);
  }

  get src(): string {
    return this.attributes.src;
  }

  set src(v: string) {
    this.triggerAttributeChanged(this.renderer, "src", v, this.attributes.src);
  }

  getSrc(): string {
    return this.src;
  }

  setSrc(src: string): this {
    this.src = src;
    return this;
  }

  onSrcChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("src", listener);
  }

  offSrcChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("src", listener);
  }
}

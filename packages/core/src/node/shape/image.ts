import type { AABB } from "@/math/aabb";
import type { Group } from "@/node/other/group";
import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";

import { Interp } from "@/animate/interp";
import { BaseShape } from "@/node/shape/base-shape";

export type ImageAttributes = SDSVGNodeAttributes & {
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
    // See rect.ts:renderAttribute — height needs its per-tick value written
    // back into attributes so the trailing y re-fire in `set height` reads
    // the current frame instead of the synchronously-set target.
    if (key === "height") (this.attributes as ImageAttributes).height = value;
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
      opacity: args?.opacity ?? 1,
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      width: args?.width ?? 40,
      height: args?.height ?? 40,
      src: args?.src ?? "",
    };

    this.renderer = this.createSVGNode("image", {
      preserveAspectRatio: "xMidYMid meet",
    });

    args?.targetNode?.appendChild(this.renderer);
  }

  getLocalBox(): AABB {
    const { x, y, width, height } = this.attributes;
    return { x, y, width, height };
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

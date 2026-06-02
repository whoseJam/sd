import type { SDNodeAttributes } from "@/node/node";

import { Interp } from "@/animate/interp";
import { SizedBoxHTMLNode } from "@/node/box-node";

export type BaseControlAttributes = SDNodeAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class BaseControl extends SizedBoxHTMLNode {
  declare attributes: BaseControlAttributes;

  getX(): number {
    return this.attributes.x;
  }

  setX(x: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "x",
      x,
      this.attributes.x,
      Interp.numberInterp,
    );
  }

  getY(): number {
    return this.attributes.y;
  }

  setY(y: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "y",
      y,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  getWidth(): number {
    return this.attributes.width;
  }

  setWidth(width: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "width",
      width,
      this.attributes.width,
      Interp.numberInterp,
    );
  }

  getHeight(): number {
    return this.attributes.height;
  }

  setHeight(height: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "height",
      height,
      this.attributes.height,
      Interp.numberInterp,
    );
  }
}

import type { AABB } from "@/math/aabb";
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

  getLocalBox(): AABB {
    const { x, y, width, height } = this.attributes;
    return { x, y, width, height };
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

  setY(y: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "y",
      y,
      this.attributes.y,
      Interp.numberInterp,
    );
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

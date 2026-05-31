import { Interp } from "@/Animate/Interp";
import { SDHTMLNode } from "@/Node/SDHTMLNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseControl extends SDHTMLNode {
  /* model fields:

        foreign: RenderNode;
        x: number;
        y: number;
        width: number;
        height: number;
        */

  constructor() {
    super();
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "x",
      x,
      this.x,
      Interp.numberInterp,
    );
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "y",
      y,
      this.y,
      Interp.numberInterp,
    );
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "width",
      width,
      this.width,
      Interp.numberInterp,
    );
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): this {
    return this.triggerAttributeChanged(
      this.foreign,
      "height",
      height,
      this.height,
      Interp.numberInterp,
    );
  }
}

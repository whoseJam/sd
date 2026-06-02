import type { BaseControlAttributes } from "@/node/control/base-control";
import type { Group } from "@/node/other/group";

import { Interp } from "@/animate/interp";
import { BaseControl } from "@/node/control/base-control";
import { Color as C } from "@/utility/color";

export type ButtonAttributes = BaseControlAttributes & {
  text: string;
};

export class Button extends BaseControl {
  declare attributes: ButtonAttributes;

  constructor(args?: {
    targetNode?: Group;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    text?: string;
  }) {
    super();

    const x = args?.x ?? 0;
    const y = args?.y ?? 0;
    const width = args?.width ?? 60;
    const height = args?.height ?? 25;
    const text = args?.text ?? "点击";
    this.attributes = {
      ...this.attributes,
      x,
      y,
      width,
      height,
      text,
    };

    const [foreign, renderer] = this.createHTMLNode("button", {
      x,
      y,
      width,
      height,
      fill: C.buttonGrey,
      stroke: C.darkButtonGrey,
      text,
    });

    this.foreign = foreign;
    this.renderer = renderer;

    args?.targetNode?.appendChild(this);
  }

  getText(): string {
    return this.attributes.text;
  }

  setText(text: string): this {
    return this.triggerAttributeChanged(
      this.renderer,
      "text",
      text,
      this.attributes.text,
      Interp.stringInterp,
    );
  }

  onClick(listener: () => void): this {
    this.renderer.element().addEventListener("click", listener);
    return this;
  }

  offClick(listener: () => void): this {
    this.renderer.element().removeEventListener("click", listener);
    return this;
  }
}

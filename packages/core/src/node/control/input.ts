import type { BaseControlAttributes } from "@/node/control/base-control";

import { Interp } from "@/animate/interp";
import { Status } from "@/interact/status";
import { BaseControl } from "@/node/control/base-control";
import { Dom } from "@/utility/dom";

export type InputAttributes = BaseControlAttributes & {
  value: string;
};

export class Input extends BaseControl {
  declare attributes: InputAttributes;

  constructor(args?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) {
    super();

    const x = args?.x ?? 0;
    const y = args?.y ?? 0;
    const width = args?.width ?? 120;
    const height = args?.height ?? 25;
    this.attributes = {
      ...this.attributes,
      x,
      y,
      width,
      height,
      value: "",
    };

    const [foreign, renderer] = this.createHTMLNode("input", {
      x,
      y,
      width,
      height,
      value: "",
      type: "text",
    });

    this.foreign = foreign;
    this.renderer = renderer;

    Dom.addEventListener(renderer.element(), "beforeinput", (event: Event) => {
      if (!Status.isInteractable()) event.preventDefault();
    });
    Dom.addEventListener(renderer.element(), "change", (event: Event) => {
      this.setValue((event.target as HTMLInputElement).value);
    });
  }

  getValue(): string {
    return this.attributes.value;
  }

  setValue(value: string | number): this {
    return this.triggerAttributeChanged(
      this.renderer,
      "value",
      String(value),
      this.attributes.value,
      Interp.stringInterp,
    );
  }
}

import type { Group } from "@/node/other/group";

import { Status } from "@/interact/status";
import {
  BaseControl,
  BaseControlAttributes,
} from "@/node/control/base-control";
import { Dom } from "@/utility/dom";

export type SliderAttributes = BaseControlAttributes & {
  min: number;
  max: number;
  value: number;
};

export class Slider extends BaseControl {
  declare attributes: SliderAttributes;

  constructor(args: {
    targetNode?: Group;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    min?: number;
    max?: number;
    value?: number;
  }) {
    super();

    const x = args?.x ?? 0;
    const y = args?.y ?? 0;
    const width = args?.width ?? 80;
    const height = args?.height ?? 20;
    const min = args?.min ?? 0;
    const max = args?.max ?? 10;
    const value = args?.value ?? 0;
    this.attributes = {
      ...this.attributes,
      x,
      y,
      width,
      height,
      min,
      max,
      value,
    };

    const [foreign, renderer] = this.createHTMLNode("input", {
      x,
      y,
      width,
      height,
      min,
      max,
      value,
      type: "range",
    });

    this.foreign = foreign;
    this.renderer = renderer;

    Dom.addEventListener(renderer.element(), "mousedown", (e) => {
      if (!Status.isInteractable()) e.preventDefault();
    });
    Dom.addEventListener(renderer.element(), "touchstart", (e) => {
      if (!Status.isInteractable()) e.preventDefault();
    });
    Dom.addEventListener(renderer.element(), "input", (e) => {
      this.setValue(+(e.target as HTMLInputElement).value);
    });

    args?.targetNode?.appendChild(this);
  }

  getMax(): number {
    return this.attributes.max;
  }

  setMax(max: number): this {
    if (this.getValue() > max) this.setValue(max);
    return this.triggerAttributeChanged(
      this.renderer,
      "max",
      max,
      this.attributes.max,
    );
  }

  getMin(): number {
    return this.attributes.min;
  }

  setMin(min: number): this {
    if (this.getValue() < min) this.setValue(min);
    return this.triggerAttributeChanged(
      this.renderer,
      "min",
      min,
      this.attributes.min,
    );
  }

  getValue(): number {
    return this.attributes.value;
  }

  setValue(value: number): this {
    return this.triggerAttributeChanged(
      this.renderer,
      "value",
      value,
      this.attributes.value,
    );
  }

  onValueChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("value", listener);
  }

  offValueChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("value", listener);
  }
}

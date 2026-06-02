import { Status } from "@/interact/status";
import { BaseControl } from "@/node/control/base-control";
import { Check } from "@/utility/check";
import { Dom } from "@/utility/dom";

export class Input extends BaseControl {
  constructor(args?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) {
    super();

    const object = this.__createHTMLNode("input", {
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      width: args?.width ?? 120,
      height: args?.height ?? 25,
      value: "",
      type: "text",
    });

    Dom.addEventListener(object.element(), "beforeinput", (event: Event) => {
      if (!Status.isInteractable()) event.preventDefault();
    });
    Dom.addEventListener(object.element(), "change", (event: Event) => {
      // @ts-ignore
      this.value(event.target.value);
    });
  }
  /**
   * Gets the value of the input component.
   * @returns The value.
   */
  getValue(): string {
    return this.vars.value;
  }
  /**
   * Sets the value of the input component.
   * @param value - The value to apply.
   * @returns The current component instance for method chaining.
   */
  setValue(value: string | number): this {
    this.vars.value = String(value);
    return this;
  }
}

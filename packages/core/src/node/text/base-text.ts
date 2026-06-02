import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";

import { Interp } from "@/animate/interp";
import { BoxSVGNode } from "@/node/box-node";

type TextMappingSubtextItem = [string, string];
type TextMappingObjectSubtextItem = [BaseText, string, string];
type TextMappingObjectItem = [BaseText, string];
type TextMappingItem =
  | TextMappingSubtextItem
  | TextMappingObjectSubtextItem
  | TextMappingObjectItem;
export type TextMappingLocation =
  | { i: number; subtext: string }
  | { object: BaseText; subtext: string }
  | string
  | BaseText;
export type TextMappingObject = {
  source: TextMappingLocation;
  target: TextMappingLocation;
};
type TextMappingDictionary = { [key: string]: string };
export type TextMapping = TextMappingDictionary | Array<TextMappingItem>;
export type TextMappingArray = Array<TextMappingObject>;

export function processMapping(mapping: TextMapping): TextMappingArray {
  const result = [] as TextMappingArray;
  function processArraySubtextItem(
    item: TextMappingSubtextItem,
  ): TextMappingObject {
    return { source: String(item[0]), target: String(item[1]) };
  }
  function processArrayObjectSubtextItem(
    item: TextMappingObjectSubtextItem,
  ): TextMappingObject {
    return {
      source: { object: item[0], subtext: String(item[1]) },
      target: String(item[2]),
    };
  }
  function processArrayObjectItem(
    item: TextMappingObjectItem,
  ): TextMappingObject {
    return { source: item[0], target: String(item[1]) };
  }
  function processArrayItem(item: Array<any>): TextMappingObject {
    if (item.length === 3)
      return processArrayObjectSubtextItem(
        item as TextMappingObjectSubtextItem,
      );
    if (typeof item[0] === "number" || typeof item[0] === "string")
      return processArraySubtextItem(item as TextMappingSubtextItem);
    return processArrayObjectItem(item as TextMappingObjectItem);
  }
  if (Array.isArray(mapping))
    return mapping.map((item) => {
      if (Array.isArray(item)) return processArrayItem(item);
      return item;
    });
  for (const key in mapping) {
    const value = mapping[key];
    result.push({
      source: String(key),
      target: String(value),
    });
  }
  return result;
}

export type TextConfigDictionary = { [key: string]: any };

export type BaseTextAttributes = SDSVGNodeAttributes & {
  x: number;
  y: number;
};

export abstract class BaseText extends BoxSVGNode {
  declare attributes: BaseTextAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "y")
      return renderer.setAttribute("y", -(value + (this.getHeight() || 0)));
    super.renderAttribute(renderer, key, value);
  }

  // SVG y depends on this.getHeight(); subclasses call this whenever their
  // height changes (setFontSize, setText, ...) to keep math y put.
  protected refreshY(renderer: RenderNode = this.renderer) {
    this.renderAttribute(renderer, "y", this.attributes.y);
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

}

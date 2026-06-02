import type { AABB } from "@/math/aabb";
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
  function processArrayItem(item: TextMappingItem): TextMappingObject {
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

// width / height are first-class reactive attributes (not class fields)
// so they participate in the animation system the same way x / y do.
// setFontSize / setText / setFontFamily trigger width/height changes
// alongside fontSize and a y re-fire; each tick's renderAttribute
// writes the lerped value back into attributes so getLocalHeight()
// reflects the current frame, and the y re-fire reads it to keep the
// math (x,y) anchor put through the tween.
export type BaseTextAttributes = SDSVGNodeAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
};

export abstract class BaseText extends BoxSVGNode {
  declare attributes: BaseTextAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "y") {
      return renderer.setAttribute(
        "y",
        -(value + (this.getLocalHeight() || 0)),
      );
    }
    // width / height live in attributes only — no DOM mapping on the
    // text/math element. Updating the attribute on every tick (rather
    // than letting it sit at the synchronously-set target) is what
    // makes the y re-fire see a current-frame height.
    if (key === "width" || key === "height") {
      (this.attributes as Record<string, unknown>)[key] = value;
      return;
    }
    super.renderAttribute(renderer, key, value);
  }

  getLocalBox(): AABB {
    return {
      x: this.attributes.x,
      y: this.attributes.y,
      width: this.attributes.width,
      height: this.attributes.height,
    };
  }

  // SVG y depends on this.getHeight(); subclasses call this whenever their
  // height changes (setFontSize, setText, ...) to keep math y put.
  protected refreshY(renderer: RenderNode = this.renderer) {
    this.renderAttribute(renderer, "y", this.attributes.y);
  }

  // Order: width, then height, then a y re-fire with source == target.
  // Each tick updates attributes.{width,height} via the renderAttribute
  // override; the trailing y re-fire reads the freshly-updated
  // attributes.height to recompute DOM y so the (x,y) anchor stays put
  // through the tween.
  protected triggerSizeChange(
    newWidth: number,
    newHeight: number,
    renderer: RenderNode | undefined = this.renderer,
  ) {
    this.triggerAttributeChanged(
      renderer,
      "width",
      newWidth,
      this.attributes.width,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      renderer,
      "height",
      newHeight,
      this.attributes.height,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      renderer,
      "y",
      this.attributes.y,
      this.attributes.y,
      Interp.numberInterp,
    );
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
}

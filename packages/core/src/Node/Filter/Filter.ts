import type { Group } from "@/Node/Other/Group";
import type { Percent } from "@/Node/SDNode";
import type { SDSVGNodeAttributes } from "@/Node/SDSVGNode";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { URLString } from "@/Utility/String";

import { Interp } from "@/Animate/Interp";
import { BaseFilter } from "@/Node/Filter/BaseFilter";
import { SDNode } from "@/Node/SDNode";
import { SDString } from "@/Utility/String";

export type SDFilter = Filter | string | URLString;

export type FilterAttributes = SDSVGNodeAttributes & {
  id: string;
  x: Percent;
  y: Percent;
  width: Percent;
  height: Percent;
};

export class Filter extends BaseFilter {
  declare attributes: FilterAttributes;

  constructor(args?: {
    targetNode?: Group;
    id?: string;
    x?: Percent;
    y?: Percent;
    width?: Percent;
    height?: Percent;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      id: args?.id ?? "",
      x: args?.x ?? "-10%",
      y: args?.y ?? "-10%",
      width: args?.width ?? "120%",
      height: args?.height ?? "120%",
    };

    this.renderer = this.createSVGNode("filter", {
      id: this.attributes.id,
      x: this.attributes.x,
      y: this.attributes.y,
      width: this.attributes.width,
      height: this.attributes.height,
    });

    args?.targetNode?.append(this);
  }

  append(child: SDNode | RenderNode) {
    if (child instanceof SDNode) {
      this.getRootRenderNode().append(child.getRootRenderNode());
      child.parent = this;
    } else this.getRootRenderNode().append(child);
    return this;
  }

  appendChild(child: SDNode | RenderNode) {
    if (child instanceof SDNode) {
      this.getRootRenderNode().appendChild(child.getRootRenderNode());
      child.parent = this;
    } else this.getRootRenderNode().appendChild(child);
    return this;
  }

  insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
    if (child instanceof SDNode) child.parent = this;
    const child_ = child instanceof SDNode ? child.getRootRenderNode() : child;
    const referenced_ =
      referenced instanceof SDNode
        ? referenced.getRootRenderNode()
        : referenced;
    this.getRootRenderNode().insertBefore(child_, referenced_);
    return this;
  }

  get id(): string {
    return this.attributes.id;
  }

  set id(v: string) {
    this.triggerAttributeChanged(
      this.renderer,
      "id",
      v,
      this.attributes.id,
      Interp.stringInterp,
    );
  }

  getId() {
    return this.id;
  }

  setId(id: string): this {
    this.id = id;
    return this;
  }

  get x(): Percent {
    return this.attributes.x;
  }

  set x(v: Percent) {
    this.triggerAttributeChanged(this.renderer, "x", v, this.attributes.x);
  }

  setX(x: Percent): this {
    this.x = x;
    return this;
  }

  get y(): Percent {
    return this.attributes.y;
  }

  set y(v: Percent) {
    this.triggerAttributeChanged(this.renderer, "y", v, this.attributes.y);
  }

  setY(y: Percent): this {
    this.y = y;
    return this;
  }

  get width(): Percent {
    return this.attributes.width;
  }

  set width(v: Percent) {
    this.triggerAttributeChanged(
      this.renderer,
      "width",
      v,
      this.attributes.width,
    );
  }

  setWidth(width: Percent): this {
    this.width = width;
    return this;
  }

  get height(): Percent {
    return this.attributes.height;
  }

  set height(v: Percent) {
    this.triggerAttributeChanged(
      this.renderer,
      "height",
      v,
      this.attributes.height,
    );
  }

  setHeight(height: Percent): this {
    this.height = height;
    return this;
  }

  static toURLString(filter: SDFilter) {
    if (filter === undefined) return "";
    if (filter instanceof Filter) return `url(#${filter.getId()})`;
    return SDString.toURLString(filter);
  }
}

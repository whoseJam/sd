import type { Percent } from "@/node/node";
import type { Group } from "@/node/other/group";
import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { URLString } from "@/utility/string";

import { Interp } from "@/animate/interp";
import { BaseFilter } from "@/node/filter/base-filter";
import { SDNode } from "@/node/node";
import { SDString } from "@/utility/string";

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

    this.renderer = this.createSVGNode("filter");

    args?.targetNode?.append(this);
  }

  append(child: SDNode | RenderNode) {
    if (child instanceof SDNode) {
      this.getRootRenderNode().append(child.getRootRenderNode());
      child.setParent(this);
    } else this.getRootRenderNode().append(child);
    return this;
  }

  appendChild(child: SDNode | RenderNode) {
    if (child instanceof SDNode) {
      this.getRootRenderNode().appendChild(child.getRootRenderNode());
      child.setParent(this);
    } else this.getRootRenderNode().appendChild(child);
    return this;
  }

  insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
    if (child instanceof SDNode) child.setParent(this);
    const childNode =
      child instanceof SDNode ? child.getRootRenderNode() : child;
    const referencedNode =
      referenced instanceof SDNode
        ? referenced.getRootRenderNode()
        : referenced;
    this.getRootRenderNode().insertBefore(childNode, referencedNode);
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

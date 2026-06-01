import type { Group } from "@/Node/Other/Group";
import type { Percent } from "@/Node/SDNode";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { URLString } from "@/Utility/String";

import { Interp } from "@/Animate/Interp";
import { BaseFilter } from "@/Node/Filter/BaseFilter";
import { SDNode } from "@/Node/SDNode";
import { SDString } from "@/Utility/String";

export type SDFilter = Filter | string | URLString;

export class Filter extends BaseFilter {
  /* model fields:

        id: string;
        */

  constructor(args?: {
    targetNode?: Group;
    id?: string;
    x?: Percent;
    y?: Percent;
    width?: Percent;
    height?: Percent;
  }) {
    super();

    this.renderer = this.createSVGNode("filter", {
      id: args?.id ?? "",
      x: args?.x ?? "-10%",
      y: args?.y ?? "-10%",
      width: args?.width ?? "120%",
      height: args?.height ?? "120%",
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
    child.parent = this;
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

  getId() {
    return this.id;
  }

  setId(id: string) {
    return this.triggerAttributeChanged(
      this.renderer,
      "id",
      id,
      this.id,
      Interp.stringInterp,
    );
  }

  setX(x: Percent) {
    return this.triggerAttributeChanged(this.renderer, "x", x, this.x);
  }

  setY(y: Percent) {
    return this.triggerAttributeChanged(this.renderer, "y", y, this.y);
  }

  setWidth(width: Percent) {
    return this.triggerAttributeChanged(
      this.renderer,
      "width",
      width,
      this.width,
    );
  }

  setHeight(height: Percent) {
    return this.triggerAttributeChanged(
      this.renderer,
      "height",
      height,
      this.height,
    );
  }

  static toURLString(filter: SDFilter) {
    if (filter === undefined) return "";
    if (filter instanceof Filter) return `url(#${filter.getId()})`;
    return SDString.toURLString(filter);
  }
}

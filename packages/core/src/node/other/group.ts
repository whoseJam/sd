import type { AABB } from "@/math/aabb";
import type { RenderNode } from "@/renderer/render-node";

import {
  aabbCorners,
  aabbFromCorners,
  composeTransform,
  transformPoint,
} from "@/math/aabb";
import { SDNode } from "@/node/node";
import { SDSVGNode } from "@/node/svg-node";

export class Group extends SDSVGNode {
  protected nodes: Array<SDNode> = [];

  constructor(args?: { targetNode?: Group; opacity?: number }) {
    super();

    this.renderer = this.createSVGNode("g", {
      opacity: args?.opacity ?? 1,
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
    const childNode =
      child instanceof SDNode ? child.getRootRenderNode() : child;
    const referencedNode =
      referenced instanceof SDNode
        ? referenced.getRootRenderNode()
        : referenced;
    this.getRootRenderNode().insertBefore(childNode, referencedNode);
    return this;
  }

  // Union of each child's local box AFTER that child's own transform — that
  // is the child's footprint in this group's local frame.
  getLocalBox(): AABB {
    if (this.nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    const corners: Array<[number, number]> = [];
    for (const child of this.nodes) {
      const childLocal = child.getLocalBox();
      const t = composeTransform(childLocal, child.attributes);
      for (const c of aabbCorners(childLocal))
        corners.push(transformPoint(c, t));
    }
    return aabbFromCorners(corners);
  }
}

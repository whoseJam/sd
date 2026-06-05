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
      this.adoptChild(child);
      this.getRootRenderNode().append(child.getRootRenderNode());
    } else this.getRootRenderNode().append(child);
    return this;
  }

  appendChild(child: SDNode | RenderNode) {
    if (child instanceof SDNode) {
      this.adoptChild(child);
      this.getRootRenderNode().appendChild(child.getRootRenderNode());
    } else this.getRootRenderNode().appendChild(child);
    return this;
  }

  insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
    if (child instanceof SDNode) this.adoptChild(child);
    const childNode =
      child instanceof SDNode ? child.getRootRenderNode() : child;
    const referencedNode =
      referenced instanceof SDNode
        ? referenced.getRootRenderNode()
        : referenced;
    this.getRootRenderNode().insertBefore(childNode, referencedNode);
    return this;
  }

  // Keep `nodes` as the authoritative SDNode-level child list so getLocalBox
  // can union real geometry. Without this nodes[] stayed empty and every
  // Group reported a zero-sized box, which broke viewBox auto-fit for any
  // anim that's purely static.
  //
  // Re-parenting (groupA.appendChild(node); groupB.appendChild(node)) needs
  // the old parent's nodes[] pruned so its bbox doesn't double-count the
  // moved child; adoptChild handles both unhooking and re-tracking in one
  // shot so every append-style entry point gets the same behavior.
  protected adoptChild(child: SDNode): void {
    const old = child.parent;
    if (old instanceof Group && old !== this) old.untrackChild(child);
    child.parent = this;
    if (this.nodes.indexOf(child) === -1) this.nodes.push(child);
  }

  untrackChild(child: SDNode): void {
    const i = this.nodes.indexOf(child);
    if (i !== -1) this.nodes.splice(i, 1);
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

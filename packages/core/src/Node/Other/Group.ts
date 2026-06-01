import type { RenderNode } from "@/Renderer/RenderNode";

import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";

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

  getX() {
    let x = this.nodes[0].getX();
    for (let i = 1; i < this.nodes.length; i++)
      x = Math.min(x, this.nodes[i].getX());
    return x;
  }

  getY() {
    let y = this.nodes[0].getY();
    for (let i = 1; i < this.nodes.length; i++)
      y = Math.min(y, this.nodes[i].getY());
    return y;
  }

  getMaxX() {
    let mx = this.nodes[0].getMaxX();
    for (let i = 1; i < this.nodes.length; i++)
      mx = Math.max(mx, this.nodes[i].getMaxX());
    return mx;
  }

  getMaxY() {
    let my = this.nodes[0].getMaxY();
    for (let i = 1; i < this.nodes.length; i++)
      my = Math.max(my, this.nodes[i].getMaxY());
    return my;
  }

  getWidth() {
    return this.getMaxX() - this.getX();
  }

  getHeight() {
    return this.getMaxY() - this.getY();
  }
}

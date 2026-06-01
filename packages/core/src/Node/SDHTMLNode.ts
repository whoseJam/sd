import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export abstract class SDHTMLNode extends SDNode {
  /**
   * Creates an HTML node wrapped in a foreignObject element.
   * @param label - The HTML element tag name
   * @param attributes - Additional attributes to apply to the HTML element
   * @returns The created RenderNode
   */
  protected createHTMLNode(
    label: string,
    attributes: Record<string, any> = {},
  ): [RenderNode, RenderNode] {
    // Initial values bypass the animation pipeline: reactive keys go
    // straight into this.attributes (no setter, no Action queued), and
    // anything else lands as a direct instance field.
    const model = this.attributes as Record<string, unknown>;
    const self = this as unknown as Record<string, unknown>;
    for (const key in attributes) {
      if (key in model) model[key] = attributes[key];
      else self[key] = attributes[key];
    }
    const foreign = RenderNode.createRenderNode(
      this,
      undefined,
      "foreignObject",
    );
    foreign.setAttribute("x", attributes.x);
    foreign.setAttribute("y", attributes.y);
    foreign.setAttribute("width", attributes.width);
    foreign.setAttribute("height", attributes.height);
    foreign.setAttribute("display", "flex");
    foreign.setAttribute("justify-content", "center");
    foreign.setAttribute("align-items", "center");
    const object = RenderNode.createRenderNode(this, foreign, label);
    object.setAttribute("width", "95%");
    object.setAttribute("height", "95%");
    for (const key in attributes) object.setAttribute(key, attributes[key]);
    return [foreign, object];
  }
}

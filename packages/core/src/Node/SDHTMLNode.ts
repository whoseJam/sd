import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export abstract class SDHTMLNode extends SDNode {
    /**
     * Creates an HTML node wrapped in a foreignObject element.
     * @param label - The HTML element tag name
     * @param attributes - Additional attributes to apply to the HTML element
     * @returns The created RenderNode
     */
    protected createHTMLNode(label: string, attributes: Record<string, any> = {}): [RenderNode, RenderNode] {
        Object.assign(this, attributes);
        const foreign = RenderNode.createRenderNode(this, undefined, "foreignObject");
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

import { Interp } from "@/Animate/Interp";
import { BaseControl } from "@/Node/Control/BaseControl";
import { Color as C } from "@/Utility/Color";
import { SDNode } from "@/Node/SDNode";

export class Button extends BaseControl {
    _: BaseControl["_"] & {
        text: string;
    };

    constructor(args?: {
        targetNode?: SDNode;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        text?: string;
    }) {
        super();

        const [foreign, renderer] = this.createHTMLNode("button", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 60,
            height: args?.height ?? 25,
            fill: C.buttonGrey,
            stroke: C.darkButtonGrey,
            text: args?.text ?? "点击",
        });

        this._.foreign = foreign;
        this._.renderer = renderer;

        args?.targetNode?.appendChild(this);
    }

    /**
     * Gets the text content of the button component.
     * @returns The text content.
     */
    getText(): string {
        return this._.text;
    }

    /**
     * Sets the text content of the button component.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     */
    setText(text: string): this {
        return this.triggerAttributeChanged(this._.renderer, "text", text, this._.text, Interp.stringInterp);
    }

    onClick(listener: () => void): this {
        this._.renderer.element().addEventListener("click", listener);
        return this;
    }

    offClick(listener: () => void): this {
        this._.renderer.element().removeEventListener("click", listener);
        return this;
    }
}

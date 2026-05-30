import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { Dom } from "@/Utility/Dom";
import { SDNode } from "@/Node/SDNode";

export class Slider extends BaseControl {
    _: BaseControl["_"] & {
        min: number;
        max: number;
        value: number;
    };

    constructor(args: {
        targetNode?: SDNode;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        min?: number;
        max?: number;
        value?: number;
    }) {
        super();

        const [foreign, renderer] = this.createHTMLNode("input", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 80,
            height: args?.height ?? 20,
            min: args?.min ?? 0,
            max: args?.max ?? 10,
            value: args?.value ?? 0,
            type: "range",
        });

        this._.foreign = foreign;
        this._.renderer = renderer;

        Dom.addEventListener(renderer.element(), "mousedown", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(renderer.element(), "touchstart", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(renderer.element(), "input", e => {
            // @ts-ignore
            this.setValue(+e.target.value);
        });

        args?.targetNode?.appendChild(this);
    }

    /**
     * Gets the maximum value of the slider component's range.
     * @returns The maximum value of the range.
     */
    getMax(): number {
        return this._.max;
    }

    /**
     * Sets the maximum value of the slider component's range. Defaults to `10`.
     * @param max - The maximum value to apply.
     * @returns The current component instance for method chaining.
     */
    setMax(max: number) {
        if (this.getValue() > max) this.setValue(max);
        return this.triggerAttributeChanged(this._.renderer, "max", max, this._.max);
    }

    /**
     * Gets the minimum value of the slider component's range.
     * @returns The minimum value of the range.
     */
    getMin(): number {
        return this._.min;
    }

    /**
     * Sets the minimum value of the slider component's range. Defaults to `0`.
     * @param min - The minimum value to apply.
     * @returns The current component instance for method chaining.
     */
    setMin(min?: number) {
        if (this.getValue() < min) this.setValue(min);
        return this.triggerAttributeChanged(this._.renderer, "min", min, this._.min);
    }

    /**
     * Gets the value of the slider component.
     * @returns The value.
     */
    getValue(): number {
        return this._.value;
    }

    /**
     * Sets the vlaue of the slider component.
     * @param value The value to apply.
     * @returns The current component instance for method chaining.
     */
    setValue(value?: number) {
        return this.triggerAttributeChanged(this._.renderer, "value", value, this._.value);
    }

    onValueChanged(listener: (vn: any, vo: any) => void) {
        return this.onAttributeChanged("value", listener);
    }

    offValueChanged(listener: (vn: any, vo: any) => void) {
        return this.offAttributeChanged("value", listener);
    }
}

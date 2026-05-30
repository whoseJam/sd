import { Interp } from "@/Animate/Interp";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";

type TextMappingSubtextItem = [string, string];
type TextMappingObjectSubtextItem = [BaseText, string, string];
type TextMappingObjectItem = [BaseText, string];
type TextMappingItem = TextMappingSubtextItem | TextMappingObjectSubtextItem | TextMappingObjectItem;
export type TextMappingLocation =
    | { i: number; subtext: string }
    | { object: BaseText; subtext: string }
    | string
    | BaseText;
export type TextMappingObject = {
    source: TextMappingLocation;
    target: TextMappingLocation;
};
type TextMappingDictionary = { [key: string]: string };
export type TextMapping = TextMappingDictionary | Array<TextMappingItem>;
export type TextMappingArray = Array<TextMappingObject>;

export function processMapping(mapping: TextMapping): TextMappingArray {
    const result = [] as TextMappingArray;
    function processArraySubtextItem(item: TextMappingSubtextItem): TextMappingObject {
        return { source: String(item[0]), target: String(item[1]) };
    }
    function processArrayObjectSubtextItem(item: TextMappingObjectSubtextItem): TextMappingObject {
        return { source: { object: item[0], subtext: String(item[1]) }, target: String(item[2]) };
    }
    function processArrayObjectItem(item: TextMappingObjectItem): TextMappingObject {
        return { source: item[0], target: String(item[1]) };
    }
    function processArrayItem(item: Array<any>): TextMappingObject {
        if (item.length === 3) return processArrayObjectSubtextItem(item as TextMappingObjectSubtextItem);
        if (typeof item[0] === "number" || typeof item[0] === "string")
            return processArraySubtextItem(item as TextMappingSubtextItem);
        return processArrayObjectItem(item as TextMappingObjectItem);
    }
    if (Array.isArray(mapping))
        return mapping.map(item => {
            if (Array.isArray(item)) return processArrayItem(item);
            return item;
        });
    for (const key in mapping) {
        const value = mapping[key];
        result.push({
            source: String(key),
            target: String(value),
        });
    }
    return result;
}

export type TextConfigDictionary = { [key: string]: any };

export abstract class BaseText extends SDSVGNode {
    _: SDSVGNode["_"] & {
        x: number;
        y: number;
    };

    renderAttribute(renderer: RenderNode, key: string, value: any) {
        if (key === "y") return renderer.setAttribute("y", -(value + (this.getHeight() || 0)));
        super.renderAttribute(renderer, key, value);
    }

    // SVG y attribute depends on this.getHeight(); subclasses call this whenever
    // their height changes (setFontSize, setText, etc.) to keep math y constant.
    protected refreshY(renderer: RenderNode = this.renderer) {
        this.renderAttribute(renderer, "y", this._.y);
    }

    getX(): number {
        return this._.x;
    }

    setX(x: number): this {
        return this.triggerAttributeChanged(this.renderer, "x", x, this._.x, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    setCenterX(cx: number): this {
        return this.setX(cx - this.getWidth() / 2);
    }

    setCx(cx: number): this {
        return this.setCenterX(cx);
    }

    setCenter(cx: number, cy: number): this;
    setCenter(center: [number, number]): this;
    setCenter(cx: number | [number, number], cy?: number): this {
        if (Array.isArray(cx)) return this.setCenterX(cx[0]).setCenterY(cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    setMaxX(mx: number): this {
        return this.setX(mx - this.getWidth());
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this.renderer, "y", y, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    setCenterY(cy: number): this {
        return this.setY(cy - this.getHeight() / 2);
    }

    setCy(cy: number): this {
        return this.setCenterY(cy);
    }

    setMaxY(my: number): this {
        return this.setY(my - this.getHeight());
    }
}

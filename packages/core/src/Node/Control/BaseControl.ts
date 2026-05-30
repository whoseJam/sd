import { Interp } from "@/Animate/Interp";
import { SDHTMLNode } from "@/Node/SDHTMLNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseControl extends SDHTMLNode {
    _: SDHTMLNode["_"] & {
        foreign: RenderNode;
        x: number;
        y: number;
        width: number;
        height: number;
    };

    constructor() {
        super();
    }

    getX(): number {
        return this._.x;
    }

    setX(x: number): this {
        return this.triggerAttributeChanged(this._.foreign, "x", x, this._.x, Interp.numberInterp);
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this._.foreign, "y", y, this._.y, Interp.numberInterp);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number): this {
        return this.triggerAttributeChanged(this._.foreign, "width", width, this._.width, Interp.numberInterp);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number): this {
        return this.triggerAttributeChanged(this._.foreign, "height", height, this._.height, Interp.numberInterp);
    }
}

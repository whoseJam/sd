import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Group } from "@/Node/Other/Group";

export class Image extends BaseShape {
    constructor(args?: {
        targetNode?: Group;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        src?: string;
        opacity?: number;
    }) {
        super();

        // Math y is the bottom edge; SVG y attribute is the top edge.
        // svg_y = -(math_y + height). Pre-flip at construction so _.y and
        // the SVG attribute start in sync (same shape as Rect).
        this.renderer = this.createSVGNode("image", {
            x: args?.x ?? 0,
            y: -((args?.y ?? 0) + (args?.height ?? 40)),
            width: args?.width ?? 40,
            height: args?.height ?? 40,
            src: args?.src ?? "",
            opacity: args?.opacity ?? 1,
            preserveAspectRatio: "xMidYMid meet",
        });

        args?.targetNode?.appendChild(this.renderer);
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

    getY(): number {
        return -this._.y - this._.height;
    }

    setY(y: number): this {
        const svgY = -(y + this._.height);
        return this.triggerAttributeChanged(this.renderer, "y", svgY, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", (svgVn, svgVo) =>
            listener(-svgVn - this._.height, -svgVo - this._.height)
        );
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number): this {
        return this.triggerAttributeChanged(this.renderer, "width", width, this._.width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number): this {
        // Keep math_y (bottom edge) constant when height changes; rewrite the
        // SVG y attribute accordingly.
        const oldHeight = this._.height;
        const oldSvgY = this._.y;
        const newSvgY = oldSvgY + oldHeight - height;
        this.triggerAttributeChanged(this.renderer, "height", height, oldHeight, Interp.numberInterp);
        return this.triggerAttributeChanged(this.renderer, "y", newSvgY, oldSvgY, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("height", listener);
    }

    getSrc(): string {
        return this._.src;
    }

    setSrc(src: string): this {
        return this.triggerAttributeChanged(this.renderer, "src", src, this._.src);
    }

    onSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("src", listener);
    }

    offSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("src", listener);
    }
}

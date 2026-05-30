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

        this._.renderer = this.createSVGNode("image", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 40,
            height: args?.height ?? 40,
            src: args?.src ?? "",
            opacity: args?.opacity ?? 1,
            preserveAspectRatio: "xMidYMid meet",
        });

        args?.targetNode?.appendChild(this._.renderer);
    }

    getX(): number {
        return this._.x;
    }

    setX(x: number): this {
        return this.triggerAttributeChanged(this._.renderer, "x", x, this._.x, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this._.renderer, "y", y, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number): this {
        return this.triggerAttributeChanged(this._.renderer, "width", width, this._.width, Interp.numberInterp);
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
        return this.triggerAttributeChanged(this._.renderer, "height", height, this._.height, Interp.numberInterp);
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
        return this.triggerAttributeChanged(this._.renderer, "src", src, this._.src);
    }

    onSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("src", listener);
    }

    offSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("src", listener);
    }
}

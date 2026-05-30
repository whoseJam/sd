import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";

export class Image extends BaseShape {
    protected x: number = 0;
    protected y: number = 0;
    protected width: number = 40;
    protected height: number = 40;
    protected src: string = "";

    renderAttribute(renderer: RenderNode, key: string, value: any) {
        if (key === "y") return renderer.setAttribute("y", -(value + this.height));
        super.renderAttribute(renderer, key, value);
    }

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

        this.x = args?.x ?? 0;
        this.y = args?.y ?? 0;
        this.width = args?.width ?? 40;
        this.height = args?.height ?? 40;
        this.src = args?.src ?? "";

        this.renderer = this.createSVGNode("image", {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            src: this.src,
            opacity: args?.opacity ?? 1,
            preserveAspectRatio: "xMidYMid meet",
        });

        args?.targetNode?.appendChild(this.renderer);
    }

    getX(): number {
        return this.x;
    }

    setX(x: number): this {
        const old = this.x;
        this.x = x;
        return this.triggerAttributeChanged(this.renderer, "x", x, old, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    getY(): number {
        return this.y;
    }

    setY(y: number): this {
        const old = this.y;
        this.y = y;
        return this.triggerAttributeChanged(this.renderer, "y", y, old, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this.width;
    }

    setWidth(width: number): this {
        const old = this.width;
        this.width = width;
        return this.triggerAttributeChanged(this.renderer, "width", width, old, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this.height;
    }

    // SVG y depends on height (svg_y = -(y + height)); a height change must
    // re-fire the y attribute so renderAttribute reads the new height.
    setHeight(height: number): this {
        const oldHeight = this.height;
        this.height = height;
        this.triggerAttributeChanged(this.renderer, "height", height, oldHeight, Interp.numberInterp);
        return this.triggerAttributeChanged(this.renderer, "y", this.y, this.y, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("height", listener);
    }

    getSrc(): string {
        return this.src;
    }

    setSrc(src: string): this {
        const old = this.src;
        this.src = src;
        return this.triggerAttributeChanged(this.renderer, "src", src, old);
    }

    onSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("src", listener);
    }

    offSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("src", listener);
    }
}

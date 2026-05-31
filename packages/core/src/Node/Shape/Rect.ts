import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor, Color as C } from "@/Utility/Color";
import { Interp } from "@/Animate/Interp";
import { Group } from "@/Node/Other/Group";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";

export class Rect extends BaseShape {
    protected x: number = 0;
    protected y: number = 0;
    protected width: number = 40;
    protected height: number = 40;
    protected rx: number = 0;
    protected ry: number = 0;

    renderAttribute(renderer: RenderNode, key: string, value: any) {
        if (key === "y") return renderer.setAttribute("y", -(value + this.height));
        super.renderAttribute(renderer, key, value);
    }

    constructor(args?: {
        targetNode?: Group;
        x?: number;
        y?: number;
        cx?: number;
        cy?: number;
        centerX?: number;
        centerY?: number;
        width?: number;
        height?: number;
        rx?: number;
        ry?: number;
        opacity?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashoffset?: number;
        strokeDashArray?: string | number | Array<number>;
        strokeDasharray?: string | number | Array<number>;
        strokeLineCap?: StrokeLineCap;
        strokeLineJoin?: StrokeLineJoin;
        filter?: SDFilter;
    }) {
        super();

        this.x = args?.x ?? 0;
        this.y = args?.y ?? 0;
        this.width = args?.width ?? 40;
        this.height = args?.height ?? 40;
        this.rx = args?.rx ?? 0;
        this.ry = args?.ry ?? 0;

        this.createSVGNode("rect", {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: this.rx,
            ry: this.ry,
            opacity: args?.opacity ?? 1,
            fill: args?.fill ?? C.black,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.none,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
            strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray ?? args?.strokeDasharray),
            strokeLineCap: args?.strokeLineCap ?? "butt",
            strokeLineJoin: args?.strokeLineJoin ?? "miter",
            filter: Filter.toURLString(args?.filter),
        });

        if (args?.cx !== undefined) this.setCx(args.cx);
        if (args?.cy !== undefined) this.setCy(args.cy);
        if (args?.centerX !== undefined) this.setCenterX(args.centerX);
        if (args?.centerY !== undefined) this.setCenterY(args.centerY);

        args?.targetNode?.appendChild(this);
    }

    getX(): number {
        return this.x;
    }

    setX(x: number): this {
        return this.change("x", x, Interp.numberInterp);
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
        return this.change("y", y, Interp.numberInterp);
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

    setWidth(width: number) {
        return this.change("width", width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this.height;
    }

    // SVG y depends on height (svg_y = -(y + height)); a height change must
    // re-fire the y attribute so renderAttribute reads the new height every
    // tick and the math-y anchor stays put.
    setHeight(height: number) {
        this.change("height", height, Interp.numberInterp);
        return this.triggerAttributeChanged(this.renderer, "y", this.y, this.y, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("height", listener);
    }

    setCenterX(cx: number) {
        return this.setX(this.getX() + cx - this.getCenterX());
    }

    setCx(cx: number) {
        return this.setCenterX(cx);
    }

    setCenterY(cy: number) {
        return this.setY(this.getY() + cy - this.getCenterY());
    }

    setCy(cy: number) {
        return this.setCenterY(cy);
    }

    setCenter(center: [number, number]): this;
    setCenter(cx: number, cy: number): this;
    setCenter(cx: number | [number, number], cy?: number) {
        if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    getRx(): number {
        return this.rx;
    }

    setRx(rx: number): this {
        return this.change("rx", rx, Interp.numberInterp);
    }

    onRxChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("rx", listener);
    }

    offRxChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("rx", listener);
    }

    getRy(): number {
        return this.ry;
    }

    setRy(ry: number): this {
        return this.change("ry", ry, Interp.numberInterp);
    }

    onRyChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("ry", listener);
    }

    offRyChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("ry", listener);
    }

    setBorderRadius(r: number): this {
        return this.setRx(r).setRy(r);
    }
}

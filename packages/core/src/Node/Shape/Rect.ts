import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { Interp } from "@/Animate/Interp";
import { Group } from "@/Node/Other/Group";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";

export class Rect extends BaseShape {
    _: BaseShape["_"] & {
        x: number;
        y: number;
        width: number;
        height: number;
        rx: number;
        ry: number;
    };

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

        // Math y is the bottom edge; SVG y attribute is the top edge. They
        // relate via svg_y = -(math_y + height). Pre-flip the construction
        // value so _.y and the SVG attribute both start as SVG.
        this.createSVGNode("rect", {
            x: args?.x ?? 0,
            y: -((args?.y ?? 0) + (args?.height ?? 40)),
            width: args?.width ?? 40,
            height: args?.height ?? 40,
            rx: args?.rx ?? 0,
            ry: args?.ry ?? 0,
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
        // _.y holds SVG top-edge y; height is identity. Math bottom y is the
        // negation of the SVG top edge minus the height.
        return -this._.y - this._.height;
    }

    setY(y: number): this {
        // y is math bottom edge. SVG y attribute = -(y + height).
        const svgY = -(y + this._.height);
        return this.triggerAttributeChanged(this.renderer, "y", svgY, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        // Listener receives math y. Note: when fired from setHeight, the height
        // used to convert vo is the post-update height, so listeners that mix
        // y- and height-change observation will see a vo offset by the delta.
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

    setWidth(width: number) {
        return this.triggerAttributeChanged(this.renderer, "width", width, this._.width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number) {
        // Math y (bottom edge) should not move when height changes. Since
        // SVG y attr = -(math_y + height), a height change forces an
        // accompanying SVG y attr change to keep math_y constant.
        const oldHeight = this._.height;
        const oldSvgY = this._.y;
        const newSvgY = oldSvgY + oldHeight - height;
        this.triggerAttributeChanged(this.renderer, "height", height, oldHeight, Interp.numberInterp);
        return this.triggerAttributeChanged(this.renderer, "y", newSvgY, oldSvgY, Interp.numberInterp);
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
        return this._.rx;
    }

    setRx(rx: number): this {
        return this.triggerAttributeChanged(this.renderer, "rx", rx, this._.rx, Interp.numberInterp);
    }

    onRxChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("rx", listener);
    }

    offRxChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("rx", listener);
    }

    getRy(): number {
        return this._.ry;
    }

    setRy(ry: number): this {
        return this.triggerAttributeChanged(this.renderer, "ry", ry, this._.ry, Interp.numberInterp);
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

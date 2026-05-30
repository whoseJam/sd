import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color as C, SDAllColor, SDHEXColor, SDRGBAColor } from "@/Utility/Color";

export type StrokeLineCap = "butt" | "round" | "square";
export type StrokeLineJoin = "miter" | "round" | "bevel";

export abstract class SDSVGNode extends SDNode {
    _: SDNode["_"] & {
        fill: SDRGBAColor;
        stroke: SDRGBAColor;
        fillOpacity: number;
        strokeOpacity: number;
        strokeWidth: number;
        strokeDashOffset: number;
        strokeDashArray: Array<number>;
        strokeLineCap: StrokeLineCap;
        strokeLineJoin: StrokeLineJoin;
    };

    constructor() {
        super();
    }

    /**
     * Gets the fill color of this component.
     * @returns The fill color.
     */
    getFill(): SDHEXColor {
        return C.toHEX(this._.fill);
    }

    /**
     * Sets the fill color of this component.
     * @param fill - The fill color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    setFill(fill: SDAllColor) {
        return this.triggerAttributeChanged(
            this.renderer,
            "fill",
            C.toRGBA(C.toFill(fill)),
            this._.fill,
            Interp.colorInterp
        );
    }

    onFillChanged(listener: (vn: any, vo: any) => void) {
        return this.onAttributeChanged("fill", listener);
    }

    offFillChanged(listener: (vn: any, vo: any) => void) {
        return this.offAttributeChanged("fill", listener);
    }

    /**
     * Gets the stroke color of this component.
     * @returns The stroke color.
     */
    getStroke(): SDHEXColor {
        return C.toHEX(this._.stroke);
    }

    /**
     * Sets the stroke color of this component.
     * @param stroke - The stroke color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    setStroke(stroke: SDAllColor): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "stroke",
            C.toRGBA(C.toStroke(stroke)),
            this._.stroke,
            Interp.colorInterp
        );
    }

    onStrokeChanged(listener: (vn: any, vo: any) => void) {
        return this.onAttributeChanged("stroke", listener);
    }

    offStrokeChanged(listener: (vn: any, vo: any) => void) {
        return this.offAttributeChanged("stroke", listener);
    }

    getFillOpacity(): number {
        return this._.fillOpacity;
    }

    setFillOpacity(opacity: number): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "fillOpacity",
            opacity,
            this._.fillOpacity,
            Interp.numberInterp
        );
    }

    onFillOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("fillOpacity", listener);
    }

    offFillOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("fillOpacity", listener);
    }

    getStrokeOpacity(): number {
        return this._.strokeOpacity;
    }

    setStrokeOpacity(opacity: number): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeOpacity",
            opacity,
            this._.strokeOpacity,
            Interp.numberInterp
        );
    }

    onStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeOpacity", listener);
    }

    offStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeOpacity", listener);
    }

    getStrokeWidth(): number {
        return this._.strokeWidth;
    }

    setStrokeWidth(width: number): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeWidth",
            width,
            this._.strokeWidth,
            Interp.numberInterp
        );
    }

    onStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeWidth", listener);
    }

    offStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeWidth", listener);
    }

    getStrokeDashOffset(): number {
        return this._.strokeDashOffset;
    }

    setStrokeDashOffset(offset: number): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeDashOffset",
            offset,
            this._.strokeDashOffset,
            Interp.numberInterp
        );
    }

    onStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeDashOffset", listener);
    }

    offStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeDashOffset", listener);
    }

    getStrokeDashArray(): Array<number> {
        return this._.strokeDashArray;
    }

    setStrokeDashArray(array: string | number | Array<number>): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeDashArray",
            SDSVGNode.toStrokeDashArray(array),
            this._.strokeDashArray,
            Interp.arrayInterp
        );
    }

    onStrokeDashArrayChanged(listener: (vn: Array<number>, vo: Array<number>) => void) {
        return this.onAttributeChanged("strokeDashArray", listener);
    }

    offStrokeDashArrayChanged(listener: (vn: Array<number>, vo: Array<number>) => void) {
        return this.offAttributeChanged("strokeDashArray", listener);
    }

    getStrokeLineCap(): StrokeLineCap {
        return this._.strokeLineCap;
    }

    setStrokeLineCap(lineCap: StrokeLineCap) {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeLineCap",
            lineCap,
            this._.strokeLineCap,
            Interp.stringInterp
        );
    }

    onStrokeLineCapChanged(listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void): this {
        return this.onAttributeChanged("strokeLineCap", listener);
    }

    offStrokeLineCapChanged(listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void): this {
        return this.offAttributeChanged("strokeLineCap", listener);
    }

    getStrokeLineJoin(): StrokeLineJoin {
        return this._.strokeLineJoin;
    }

    setStrokeLineJoin(lineJoin: StrokeLineJoin): this {
        return this.triggerAttributeChanged(
            this.renderer,
            "strokeLineJoin",
            lineJoin,
            this._.strokeLineJoin,
            Interp.stringInterp
        );
    }

    onStrokeLineJoinChanged(listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void): this {
        return this.onAttributeChanged("strokeLineJoin", listener);
    }

    offStrokeLineJoinChanged(listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void): this {
        return this.offAttributeChanged("strokeLineJoin", listener);
    }

    protected createSVGNode(label: string, attributes: Record<string, any> = {}): RenderNode {
        Object.assign(this._, attributes);
        const object = RenderNode.createRenderNode(this, undefined, label);
        this.renderer = object;
        for (const key in attributes) this.renderAttribute(object, key, attributes[key]);
        return object;
    }

    protected static toStrokeDashArray(strokeDashArray: string | number | Array<number>): Array<number> {
        if (strokeDashArray === undefined) return [];
        if (typeof strokeDashArray === "number") return [strokeDashArray];
        if (typeof strokeDashArray === "string") return strokeDashArray.split(/[\s,]+/).map(value => +value);
        return strokeDashArray;
    }
}

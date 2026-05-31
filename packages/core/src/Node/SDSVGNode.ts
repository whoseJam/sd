import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRuntime } from "@/Runtime";
import { Color as C, SDAllColor, SDHEXColor, SDRGBAColor } from "@/Utility/Color";

export type StrokeLineCap = "butt" | "round" | "square";
export type StrokeLineJoin = "miter" | "round" | "bevel";

export abstract class SDSVGNode extends SDNode {
    protected fill: SDRGBAColor;
    protected stroke: SDRGBAColor;
    protected fillOpacity: number = 1;
    protected strokeOpacity: number = 1;
    protected strokeWidth: number = 1;
    protected strokeDashOffset: number = 0;
    protected strokeDashArray: Array<number> = [];
    protected strokeLineCap: StrokeLineCap = "butt";
    protected strokeLineJoin: StrokeLineJoin = "miter";

    constructor(parent?: SDNode | RenderNode | SDRuntime) {
        super(parent);
    }

    getFill(): SDHEXColor {
        return C.toHEX(this.fill);
    }

    setFill(fill: SDAllColor) {
        return this.change("fill", C.toRGBA(C.toFill(fill)), Interp.colorInterp);
    }

    onFillChanged(listener: (vn: any, vo: any) => void) {
        return this.onAttributeChanged("fill", listener);
    }

    offFillChanged(listener: (vn: any, vo: any) => void) {
        return this.offAttributeChanged("fill", listener);
    }

    getStroke(): SDHEXColor {
        return C.toHEX(this.stroke);
    }

    setStroke(stroke: SDAllColor): this {
        return this.change("stroke", C.toRGBA(C.toStroke(stroke)), Interp.colorInterp);
    }

    onStrokeChanged(listener: (vn: any, vo: any) => void) {
        return this.onAttributeChanged("stroke", listener);
    }

    offStrokeChanged(listener: (vn: any, vo: any) => void) {
        return this.offAttributeChanged("stroke", listener);
    }

    getFillOpacity(): number {
        return this.fillOpacity;
    }

    setFillOpacity(opacity: number): this {
        return this.change("fillOpacity", opacity, Interp.numberInterp);
    }

    onFillOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("fillOpacity", listener);
    }

    offFillOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("fillOpacity", listener);
    }

    getStrokeOpacity(): number {
        return this.strokeOpacity;
    }

    setStrokeOpacity(opacity: number): this {
        return this.change("strokeOpacity", opacity, Interp.numberInterp);
    }

    onStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeOpacity", listener);
    }

    offStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeOpacity", listener);
    }

    getStrokeWidth(): number {
        return this.strokeWidth;
    }

    setStrokeWidth(width: number): this {
        return this.change("strokeWidth", width, Interp.numberInterp);
    }

    onStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeWidth", listener);
    }

    offStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeWidth", listener);
    }

    getStrokeDashOffset(): number {
        return this.strokeDashOffset;
    }

    setStrokeDashOffset(offset: number): this {
        return this.change("strokeDashOffset", offset, Interp.numberInterp);
    }

    onStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("strokeDashOffset", listener);
    }

    offStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("strokeDashOffset", listener);
    }

    getStrokeDashArray(): Array<number> {
        return this.strokeDashArray;
    }

    setStrokeDashArray(array: string | number | Array<number>): this {
        return this.change("strokeDashArray", SDSVGNode.toStrokeDashArray(array), Interp.arrayInterp);
    }

    onStrokeDashArrayChanged(listener: (vn: Array<number>, vo: Array<number>) => void) {
        return this.onAttributeChanged("strokeDashArray", listener);
    }

    offStrokeDashArrayChanged(listener: (vn: Array<number>, vo: Array<number>) => void) {
        return this.offAttributeChanged("strokeDashArray", listener);
    }

    getStrokeLineCap(): StrokeLineCap {
        return this.strokeLineCap;
    }

    setStrokeLineCap(lineCap: StrokeLineCap) {
        return this.change("strokeLineCap", lineCap, Interp.stringInterp);
    }

    onStrokeLineCapChanged(listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void): this {
        return this.onAttributeChanged("strokeLineCap", listener);
    }

    offStrokeLineCapChanged(listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void): this {
        return this.offAttributeChanged("strokeLineCap", listener);
    }

    getStrokeLineJoin(): StrokeLineJoin {
        return this.strokeLineJoin;
    }

    setStrokeLineJoin(lineJoin: StrokeLineJoin): this {
        return this.change("strokeLineJoin", lineJoin, Interp.stringInterp);
    }

    onStrokeLineJoinChanged(listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void): this {
        return this.onAttributeChanged("strokeLineJoin", listener);
    }

    offStrokeLineJoinChanged(listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void): this {
        return this.offAttributeChanged("strokeLineJoin", listener);
    }

    protected createSVGNode(label: string, attributes: Record<string, any> = {}): RenderNode {
        Object.assign(this._, attributes);
        Object.assign(this, attributes);
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

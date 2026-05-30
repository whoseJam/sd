import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { Group } from "@/Node/Other/Group";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { TransformOrigin } from "@/Node/SDNode";

export class Circle extends BaseShape {
    constructor(args?: {
        targetNode?: Group;
        cx?: number;
        cy?: number;
        centerX?: number;
        centerY?: number;
        r?: number;
        transformOrigin?: TransformOrigin;
        translate?: [number, number];
        rotate?: number;
        scale?: [number, number];
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

        this._.renderer = this.createSVGNode("circle", {
            cx: args?.cx ?? args?.centerX ?? 0,
            cy: args?.cy ?? args?.centerY ?? 0,
            r: args?.r ?? 20,
            transformOrigin: args?.transformOrigin ?? ["center", "center"],
            translate: args?.translate ?? [0, 0],
            rotate: args?.rotate ?? 0,
            scale: args?.scale ?? [1, 1],
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

        args?.targetNode?.appendChild(this);
    }

    getCx(): number {
        return this._.cx;
    }

    setCx(cx: number): this {
        return this.triggerAttributeChanged(this._.renderer, "cx", cx, this._.cx, Interp.numberInterp);
    }

    onCxChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("cx", listener);
    }

    offCxChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("cx", listener);
    }

    getCenterX(): number {
        return this.getCx();
    }

    setCenterX(cx: number): this {
        return this.setCx(cx);
    }

    onCenterXChanged(listener: (vn: number, vo: number) => void) {
        return this.onCxChanged(listener);
    }

    offCenterXChanged(listener: (vn: number, vo: number) => void) {
        return this.offCxChanged(listener);
    }

    getCy(): number {
        return this._.cy;
    }

    setCy(cy: number): this {
        return this.triggerAttributeChanged(this._.renderer, "cy", cy, this._.cy, Interp.numberInterp);
    }

    onCyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("cy", listener);
    }

    offCyChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("cy", listener);
    }

    getCenterY(): number {
        return this.getCy();
    }

    setCenterY(cy: number): this {
        return this.setCy(cy);
    }

    onCenterYChanged(listener: (vn: number, vo: number) => void) {
        return this.onCyChanged(listener);
    }

    offCenterYChanged(listener: (vn: number, vo: number) => void) {
        return this.offCyChanged(listener);
    }

    setCenter(center: [number, number]): this;
    setCenter(cx: number, cy: number): this;
    setCenter(cx: number | [number, number], cy?: number) {
        if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    getR(): number {
        return this._.r;
    }

    getRadius(): number {
        return this.getR();
    }

    setR(r: number): this {
        return this.triggerAttributeChanged(this._.renderer, "r", r, this._.r, Interp.numberInterp);
    }

    setRadius(r: number): this {
        return this.setR(r);
    }

    onRChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("r", listener);
    }

    offRChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("r", listener);
    }

    getX(): number {
        return this.getCenterX() - this.getR();
    }

    setX(x: number): this {
        return this.setCenterX(this.getCenterX() + x - this.getX());
    }

    getY(): number {
        return this.getCenterY() - this.getR();
    }

    setY(y: number): this {
        return this.setCenterY(this.getCenterY() + y - this.getY());
    }

    getWidth(): number {
        return this.getR() * 2;
    }

    setWidth(width: number): this {
        return this.setR(width / 2);
    }

    getHeight(): number {
        return this.getR() * 2;
    }

    setHeight(height: number): this {
        return this.setR(height / 2);
    }
}

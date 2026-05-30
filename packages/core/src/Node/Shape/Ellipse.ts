import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { Group } from "@/Node/Other/Group";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";

export class Ellipse extends BaseShape {
    constructor(args?: {
        targetNode?: Group;
        cx?: number;
        cy?: number;
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

        this.renderer = this.createSVGNode("ellipse", {
            rx: args?.rx ?? 20,
            ry: args?.ry ?? 20,
            cx: args?.cx ?? 20,
            // Math cy → SVG cy flip at construction (see Circle.ts).
            cy: -(args?.cy ?? 20),
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
            filter: Filter.toURLString(args?.filter) ?? "",
        });

        args?.targetNode?.appendChild(this);
    }

    getX(): number {
        return this.getCenterX() - this.getRx();
    }

    setX(x: number): this {
        return this.setCenterX(this.getCenterX() + x - this.getX());
    }

    getY(): number {
        return this.getCenterY() - this.getRy();
    }

    setY(y: number): this {
        return this.setCenterY(this.getCenterY() + y - this.getY());
    }

    getWidth(): number {
        return this.getRx() * 2;
    }

    setWidth(width: number): this {
        return this.setRx(width / 2);
    }

    getHeight(): number {
        return this.getRy() * 2;
    }

    setHeight(height: number): this {
        return this.setRy(height / 2);
    }

    getCx(): number {
        return this._.cx;
    }

    setCx(cx: number): this {
        return this.triggerAttributeChanged(this.renderer, "cx", cx, this._.cx, Interp.numberInterp);
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
        return -this._.cy;
    }

    setCy(cy: number): this {
        return this.triggerAttributeChanged(this.renderer, "cy", -cy, this._.cy, Interp.numberInterp);
    }

    onCyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("cy", (svgVn, svgVo) => listener(-svgVn, -svgVo));
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

    getRx(): number {
        return this._.rx;
    }

    setRx(rx: number): this {
        return this.triggerAttributeChanged(this.renderer, "rx", rx, this._.rx, Interp.numberInterp);
    }

    onRxChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("rx", listener);
    }

    offRxChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("rx", listener);
    }

    getRy(): number {
        return this._.ry;
    }

    setRy(ry: number): this {
        return this.triggerAttributeChanged(this.renderer, "ry", ry, this._.ry, Interp.numberInterp);
    }

    onRyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("ry", listener);
    }

    offRyChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("ry", listener);
    }
}

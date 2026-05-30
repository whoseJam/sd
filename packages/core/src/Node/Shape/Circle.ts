import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { Group } from "@/Node/Other/Group";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { TransformOrigin } from "@/Node/SDNode";

export class Circle extends BaseShape {
    // Model fields — store SVG attribute values directly. cy and r are
    // identity with the SVG attribute; cy stores the SVG cy (= -math_cy).
    // User-facing getters/setters handle the math flip; never touch these
    // fields directly from outside Circle.
    protected cx: number = 0;
    protected cy: number = 0;
    protected r: number = 20;

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

        this.cx = args?.cx ?? args?.centerX ?? 0;
        // Flip math cy → SVG cy at construction so this.cy and the SVG
        // attribute agree with the rest of setCy/getCy.
        this.cy = -(args?.cy ?? args?.centerY ?? 0);
        this.r = args?.r ?? 20;

        this.renderer = this.createSVGNode("circle", {
            cx: this.cx,
            cy: this.cy,
            r: this.r,
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
        return this.cx;
    }

    setCx(cx: number): this {
        const oldCx = this.cx;
        this.cx = cx;
        return this.triggerAttributeChanged(this.renderer, "cx", cx, oldCx, Interp.numberInterp);
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
        // this.cy stores the SVG attribute value; flip back to math for callers.
        return -this.cy;
    }

    setCy(cy: number): this {
        // cy is math y from the user. Store and write SVG (-cy) so the on-screen
        // position matches math convention (y grows up).
        const svgCy = -cy;
        const oldSvgCy = this.cy;
        this.cy = svgCy;
        return this.triggerAttributeChanged(this.renderer, "cy", svgCy, oldSvgCy, Interp.numberInterp);
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

    getR(): number {
        return this.r;
    }

    getRadius(): number {
        return this.getR();
    }

    setR(r: number): this {
        const oldR = this.r;
        this.r = r;
        return this.triggerAttributeChanged(this.renderer, "r", r, oldR, Interp.numberInterp);
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

import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { Group } from "@/Node/Other/Group";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { Interp } from "@/Animate/Interp";
import { TransformOrigin } from "@/Node/SDNode";

export class Polyline extends BasePath {
    protected points: Array<[number, number]> = [];

    renderAttribute(renderer: RenderNode, key: string, value: any) {
        if (key === "points") {
            const flipped = (value as Array<[number, number]>).map(([px, py]) => [px, -py] as [number, number]);
            return renderer.setAttribute("points", flipped);
        }
        super.renderAttribute(renderer, key, value);
    }

    constructor(args?: {
        targetNode?: Group;
        points?: Array<[number, number]>;
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

        this.points = args?.points ?? [];

        this.createSVGNode("polyline", {
            points: this.points,
            transformOrigin: args?.transformOrigin ?? ["center", "center"],
            translate: args?.translate ?? [0, 0],
            rotate: args?.rotate ?? 0,
            scale: args?.scale ?? [1, 1],
            opacity: args?.opacity ?? 1,
            fill: args?.fill ?? C.none,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.black,
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

    getX() {
        return PolylineEngine.toBox(this.points).x;
    }

    getY() {
        return PolylineEngine.toBox(this.points).y;
    }

    getWidth() {
        return PolylineEngine.toBox(this.points).width;
    }

    getHeight() {
        return PolylineEngine.toBox(this.points).height;
    }

    getPointAtRate(k: number) {
        return PolylineEngine.getPointByRate(this.points, k);
    }

    getPointAtLength(length: number): [number, number] {
        return PolylineEngine.getPointAtLength(this.points, length);
    }

    totalLength(): number {
        return PolylineEngine.getTotalLength(this.points);
    }

    getPoints(): Array<[number, number]> {
        return this.points;
    }

    setPoints(points: Array<[number, number]>): this {
        const old = this.points;
        this.points = points;
        return this.triggerAttributeChanged(this.renderer, "points", points, old, Interp.pointsInterp);
    }

    onPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void): this {
        return this.onAttributeChanged("points", listener);
    }

    offPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void): this {
        return this.offAttributeChanged("points", listener);
    }
}

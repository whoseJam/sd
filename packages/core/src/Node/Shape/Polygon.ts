import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { PolygonEngine } from "@/Node/Shape/PolygonEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Group } from "@/Node/Other/Group";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";

export class Polygon extends BaseShape {
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
        points?: string | Array<[number, number]>;
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

        this.points = Polygon.toPoints(args?.points);

        this.renderer = this.createSVGNode("polygon", {
            points: this.points,
            transformOrigin: ["center", "center"],
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

    getX() {
        return PolygonEngine.pointsToBox(this.points).x;
    }

    getY() {
        return PolygonEngine.pointsToBox(this.points).y;
    }

    getWidth() {
        return PolygonEngine.pointsToBox(this.points).width;
    }

    getHeight() {
        return PolygonEngine.pointsToBox(this.points).height;
    }

    getPoints() {
        return this.points;
    }

    setPoints(points: Array<[number, number]>): this {
        return this.change("points", points, Interp.pointsInterp);
    }

    onPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void) {
        return this.onAttributeChanged("points", listener);
    }

    offPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void) {
        return this.offAttributeChanged("points", listener);
    }

    setX(x: number): this {
        const box = PolygonEngine.pointsToBox(this.points);
        const dx = x - box.x;
        return this.setPoints(this.points.map(([px, py]) => [px + dx, py] as [number, number]));
    }

    setY(y: number): this {
        const box = PolygonEngine.pointsToBox(this.points);
        const dy = y - box.y;
        return this.setPoints(this.points.map(([px, py]) => [px, py + dy] as [number, number]));
    }

    setWidth(width: number): this {
        const box = PolygonEngine.pointsToBox(this.points);
        const scale = width / box.width;
        return this.setPoints(this.points.map(([px, py]) => [box.x + (px - box.x) * scale, py] as [number, number]));
    }

    setHeight(height: number): this {
        const box = PolygonEngine.pointsToBox(this.points);
        const scale = height / box.height;
        return this.setPoints(this.points.map(([px, py]) => [px, box.y + (py - box.y) * scale] as [number, number]));
    }

    private static toPoints(points: string | Array<[number, number]>): Array<[number, number]> {
        if (points === undefined) return [];
        if (typeof points === "string")
            return points.split(" ").map(p => p.split(",").map(n => parseFloat(n)) as [number, number]);
        return points;
    }
}

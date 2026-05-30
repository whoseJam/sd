import { BasePath } from "@/Node/Path/BasePath";
import { PathEngine } from "@/Node/Path/PathEngine";
import { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { Interp } from "@/Animate/Interp";
import { TransformOrigin } from "@/Node/SDNode";

export class Path extends BasePath {
    protected d: string = "";
    protected x: number = 0;
    protected y: number = 0;
    protected width: number = 0;
    protected height: number = 0;

    renderAttribute(renderer: RenderNode, key: string, value: any) {
        if (key === "d") return renderer.setAttribute("d", PathEngine.flipY(value));
        super.renderAttribute(renderer, key, value);
    }

    constructor(args?: {
        targetNode?: Group;
        d?: string;
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

        this.d = args?.d ?? "";
        const box = PathEngine.toBox(this.d);
        this.x = box.x ?? 0;
        this.y = box.y ?? 0;
        this.width = box.width ?? 0;
        this.height = box.height ?? 0;

        this.createSVGNode("path", {
            d: this.d,
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
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getPointAtRate(k: number): [number, number] {
        const [x, y] = PathEngine.getPointByRate(PathEngine.flipY(this.d), k);
        return [x, -y];
    }

    getPointAtLength(length: number): [number, number] {
        const [x, y] = PathEngine.getPointAtLength(PathEngine.flipY(this.d), length);
        return [x, -y];
    }

    totalLength() {
        return PathEngine.getTotalLength(PathEngine.flipY(this.d));
    }

    getD(): string {
        return this.d;
    }

    setD(d: string): this {
        const old = this.d;
        this.d = d;
        const box = PathEngine.toBox(d);
        this.x = box.x ?? 0;
        this.y = box.y ?? 0;
        this.width = box.width ?? 0;
        this.height = box.height ?? 0;
        return this.triggerAttributeChanged(this.renderer, "d", d, old, Interp.pathInterp);
    }
}

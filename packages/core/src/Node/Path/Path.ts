import { BasePath } from "@/Node/Path/BasePath";
import { PathEngine } from "@/Node/Path/PathEngine";
import { Group } from "@/Node/Other/Group";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import { Interp } from "@/Animate/Interp";
import { TransformOrigin } from "@/Node/SDNode";

export class Path extends BasePath {
    _: BasePath["_"] & {
        d: string;
        x: number;
        y: number;
        width: number;
        height: number;
    };

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

        this.createSVGNode("path", {
            d: args?.d ?? "",
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

        const box = PathEngine.toBox(args?.d ?? "");

        Object.assign(this._, {
            d: args?.d ?? "",
            x: box.x ?? 0,
            y: box.y ?? 0,
            width: box.width ?? 0,
            height: box.height ?? 0,
        });

        args?.targetNode?.appendChild(this);
    }

    getX() {
        return this._.x;
    }

    getY() {
        return this._.y;
    }

    getWidth() {
        return this._.width;
    }

    getHeight() {
        return this._.height;
    }

    getPointAtRate(k: number) {
        return PathEngine.getPointByRate(this.getD(), k);
    }

    getPointAtLength(length: number) {
        return PathEngine.getPointAtLength(this.getD(), length);
    }

    totalLength() {
        return PathEngine.getTotalLength(this.getD());
    }

    getD(): string {
        return this._.d;
    }

    setD(d: string): this {
        Object.assign(this._, { d, ...PathEngine.toBox(d) });
        return this.triggerAttributeChanged(this.renderer, "d", d, this._.d, Interp.pathInterp);
    }
}

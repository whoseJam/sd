import { Root, svg } from "@/Interact/Root";
import { SDBox, SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export type PathCode =
    | "M"
    | "m"
    | "L"
    | "l"
    | "H"
    | "h"
    | "V"
    | "v"
    | "C"
    | "c"
    | "S"
    | "s"
    | "Q"
    | "q"
    | "T"
    | "t"
    | "A"
    | "a"
    | "Z"
    | "z";
export type PathOper = [PathCode, ...number[]];
export type PathOpers = Array<PathOper>;

export class PathEngine {
    static pathSVG = undefined;
    static init() {
        this.pathSVG = RenderNode.createRenderNodeWithoutAction(undefined, Root.svg, "path");
        this.pathSVG.setAttribute("opacity", 0);
    }
    static toBox(d: string): SDBox {
        this.pathSVG.setAttribute("d", d);
        return this.pathSVG.element().getBBox();
    }
    static toOpers(d: string): PathOpers {
        // @ts-ignore
        return Snap.parsePathString(d);
    }
    static toCubic(path: string | PathOpers): PathOpers {
        // @ts-ignore
        return Snap.path.toCubic(path);
    }
    static toCubics(path1: string | PathOpers, path2: string | PathOpers): [PathOpers, PathOpers] {
        // @ts-ignore
        return Snap.path.toCubic(path1, path2);
    }
    static toString(operators: PathOpers): string {
        let ans = "";
        for (const operator of operators) ans += operator.join(" ");
        return ans;
    }
    static updatePath(d: string, x0: number, y0: number, dx: number, dy: number, sx: number, sy: number): string {
        const fx = (x: number) => (x - x0) * sx + x0 + dx;
        const fy = (y: number) => (y - y0) * sy + y0 + dy;
        const operators = this.toOpers(d);
        operators.forEach(operator => {
            const code = operator[0];
            switch (code) {
                case "M":
                case "T":
                case "L": {
                    const [x, y] = operator.slice(1) as [number, number];
                    operator[1] = fx(x);
                    operator[2] = fy(y);
                    break;
                }
                case "H": {
                    const x = operator[1];
                    operator[1] = fx(x);
                    break;
                }
                case "V": {
                    const y = operator[1];
                    operator[1] = fy(y);
                    break;
                }
                case "Q":
                case "S": {
                    const [x1, y1, x, y] = operator.slice(1) as [number, number, number, number];
                    operator[1] = fx(x1);
                    operator[2] = fy(y1);
                    operator[3] = fx(x);
                    operator[4] = fy(y);
                    break;
                }
                case "C": {
                    const [x1, y1, x2, y2, x, y] = operator.slice(1) as [
                        number,
                        number,
                        number,
                        number,
                        number,
                        number
                    ];
                    operator[1] = fx(x1);
                    operator[2] = fy(y1);
                    operator[3] = fx(x2);
                    operator[4] = fy(y2);
                    operator[5] = fx(x);
                    operator[6] = fy(y);
                    break;
                }
                case "A": {
                    operator[1] *= sx;
                    operator[2] *= sy;
                    operator[6] = fx(operator[6]);
                    operator[7] = fy(operator[7]);
                    break;
                }
            }
        });
        return this.toString(operators);
    }
    static getPointAtLength(d: string, length: number): [number, number] {
        try {
            this.pathSVG.setAttribute("d", d);
            const point = this.pathSVG.element().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getPointByRate(d: string, k: number): [number, number] {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.element().getTotalLength() * k;
            const point = this.pathSVG.element().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getTotalLength(d: string) {
        try {
            this.pathSVG.setAttribute("d", d);
            return this.pathSVG.element().getTotalLength();
        } catch (err) {
            return 0;
        }
    }
    static __trimSource(source: SDNode) {
        if (!source) return 0;
        const t = this.pathSVG.element().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.element().getPointAtLength(length);
            if (source.inRange([point.x, point.y])) l = mid;
            else r = mid;
        }
        if (t * l <= 1) return 0;
        return l;
    }
    static __trimTarget(target: SDNode) {
        if (!target) return 1;
        const t = this.pathSVG.element().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.element().getPointAtLength(length);
            if (target.inRange([point.x, point.y])) r = mid;
            else l = mid;
        }
        if (t * (1 - l) <= 1) return 1;
        return l;
    }
    static trim(d: string, source: SDNode, target: SDNode) {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.element().getTotalLength();
            const s = this.__trimSource(source);
            const t = this.__trimTarget(target);
            const ps = this.pathSVG.element().getPointAtLength(s * length);
            const pt = this.pathSVG.element().getPointAtLength(t * length);
            return [
                [ps.x, ps.y],
                [pt.x, pt.y],
            ];
        } catch (err) {
            return [
                [0, 0],
                [0, 0],
            ];
        }
    }
}

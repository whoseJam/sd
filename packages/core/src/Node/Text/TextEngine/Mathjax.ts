import { RenderNode } from "@/Renderer/RenderNode";
import { Root } from "@/Interact/Root";
import { PathStyle, PathView } from "@/Node/Text/TextEngine/TextView";
import { Dom } from "@/Utility/Dom";
import { PathPen } from "@/Node/Path/PathPen";
import { Color as C } from "@/Utility/Color";

export class MathManager {
    private static mathSVG: RenderNode;

    static init() {
        this.mathSVG = RenderNode.createRenderNodeWithoutAction(undefined, Root.svg, "g");
        this.mathSVG.setAttribute("opacity", 0);
        this.mathSVG.setAttribute("font-size", 20);
    }

    static boundingBox(y: number, math: RenderNode) {
        const parentNode = math.element().parentNode;
        this.mathSVG.__append(math);
        const bbox = (this.mathSVG.element() as SVGGElement).getBBox();
        if (parentNode) parentNode.appendChild(math.element());
        else math.__remove();
        const delta = bbox.y - y;
        bbox.height += delta * 2;
        return bbox;
    }

    static boundingBoxAndInnerBoundingBox(math: RenderNode) {
        const parentNode = math.element().parentNode;
        this.mathSVG.__append(math);
        const bbox = (this.mathSVG.element() as SVGGElement).getBBox();
        const ibbox = (math.element().children[1] as SVGGElement).getBBox();
        if (parentNode) parentNode.appendChild(math.element());
        else math.__remove();
        return [bbox, ibbox];
    }

    static getMathPaths(y: number, math: RenderNode): Array<PathView> {
        if (!math) return [];
        const defs: SVGDefsElement = math.element().children[0] as SVGDefsElement;
        const root: SVGGElement = math.element().children[1] as SVGGElement;
        const paths = [];
        const initialMatrix = () => {
            const svg = math.element();
            const [bbox, ibbox] = this.boundingBoxAndInnerBoundingBox(math);
            const view = svg.getAttribute("viewBox").split(" ");
            const [vx, vy, vw, vh] = [+view[0], +view[1], +view[2], +view[3]];
            const x_ = +svg.getAttribute("x");
            const y_ = +svg.getAttribute("y") + (bbox.y - y);
            const w = bbox.width * (vw / ibbox.width);
            const h = bbox.height * (vh / ibbox.height);
            return new DOMMatrix([w / vw, 0, 0, h / vh, x_ - (w / vw) * vx, y_ - (h / vh) * vy]);
        };
        const extract = (current: SVGElement): string => {
            if (Dom.tagName(current) === "rect") {
                const x = +current.getAttribute("x");
                const y = +current.getAttribute("y");
                const mx = +current.getAttribute("width") + x;
                const my = +current.getAttribute("height") + y;
                return new PathPen().MoveTo(x, y).LineTo(mx, y).LineTo(mx, my).LineTo(x, my).LineTo(x, y).toString();
            } else {
                const href = current.getAttribute("xlink:href");
                const src = defs.querySelector(href);
                return src.getAttribute("d");
            }
        };
        const dfs = (current: SVGGraphicsElement, matrix: DOMMatrix, fill: string, stroke: string) => {
            for (let i = 0; i < current.transform.baseVal.length; i++) {
                if (current === root && i === current.transform.baseVal.length - 2) continue;
                matrix = matrix.multiply(current.transform.baseVal[i].matrix);
            }
            fill = current.getAttribute("fill") ?? fill;
            stroke = current.getAttribute("stroke") ?? stroke;
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
                const d = extract(current);
                const p = new PathView(d, matrix);
                paths.push(p);
            }
            for (let i = 0; i < current.children.length; i++)
                dfs(current.children[i] as SVGGraphicsElement, matrix, fill, stroke);
        };
        dfs(root, initialMatrix(), "default", "default");
        return paths;
    }

    static getMathText(math: RenderNode): Array<string> {
        if (!math) return [];
        const root: SVGGElement = math.element().children[1] as SVGGElement;
        const text = [];
        const extract = (current: SVGElement): string => {
            if (Dom.tagName(current) === "rect") return "rect";
            return current.getAttribute("data-c");
        };
        const dfs = (current: SVGGraphicsElement) => {
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") text.push(extract(current));
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i] as SVGGraphicsElement);
        };
        dfs(root);
        return text;
    }

    static applyStyles(math: RenderNode, styles: Array<PathStyle>) {
        if (!math) return;
        let i = 0;
        const root: SVGGElement = math.element().children[1] as SVGGElement;
        const apply = (current: SVGElement) => {
            const style = styles[i];
            if (style.fill !== "default") current.setAttribute("fill", C.toString(style.fill));
            if (style.stroke !== "default") current.setAttribute("stroke", C.toString(style.stroke));
            if (i + 1 < styles.length) i++;
        };
        const dfs = (current: SVGGraphicsElement) => {
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") apply(current);
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i] as SVGGraphicsElement);
        };
        dfs(root);
    }

    static adjustMath(math: RenderNode) {
        this.mathSVG.__append(math);
        const root = math.element().children[1] as SVGGElement;
        const ibbox = root.getBBox();
        const transform = `${root.getAttribute("transform")} scale(0.8) translate(${-ibbox.x},0)`;
        root.setAttribute("transform", transform);
        math.__remove();
    }
}

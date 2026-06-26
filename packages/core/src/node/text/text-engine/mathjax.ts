import type { PathStyle } from "@/node/text/text-engine/text-view";

import { Root } from "@/interact/root";
import { PathPen } from "@/node/path/path-pen";
import { PathView } from "@/node/text/text-engine/text-view";
import { RenderNode } from "@/renderer/render-node";
import { Color as C } from "@/utility/color";
import { Dom } from "@/utility/dom";

export class MathManager {
  private static mathSVG: RenderNode;

  static init() {
    this.mathSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "g",
    );
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
    return [bbox, ibbox] as const;
  }

  static getMathPaths(math: RenderNode): Array<PathView> {
    if (!math) return [];
    const defs: SVGDefsElement = math.element().children[0] as SVGDefsElement;
    const root: SVGGElement = math.element().children[1] as SVGGElement;
    const paths = [];
    // Map root local → parent user units. bbox / ibbox give the combined
    // scale (preserveAspectRatio meet × adjustMath's scale(0.8)) directly,
    // bypassing the math <svg>'s "ex" width attribute (which would need a
    // font-size DOM context to resolve). The +(ibbox.y + ibbox.height) × scale
    // term compensates for MathJax's root scale(1,-1): the rendered top
    // corresponds to ibbox's bottom in root's local y.
    const initialMatrix = () => {
      const [bbox, ibbox] = this.boundingBoxAndInnerBoundingBox(math);
      const scale = bbox.width / ibbox.width;
      return new DOMMatrix([
        scale,
        0,
        0,
        scale,
        bbox.x,
        bbox.y + (ibbox.y + ibbox.height) * scale,
      ]);
    };
    const extract = (current: SVGElement): string => {
      if (Dom.tagName(current) === "rect") {
        const x = +current.getAttribute("x");
        const y = +current.getAttribute("y");
        const mx = +current.getAttribute("width") + x;
        const my = +current.getAttribute("height") + y;
        return new PathPen()
          .MoveTo(x, y)
          .LineTo(mx, y)
          .LineTo(mx, my)
          .LineTo(x, my)
          .LineTo(x, y)
          .toString();
      } else {
        const href = current.getAttribute("xlink:href");
        const src = defs.querySelector(href);
        return src.getAttribute("d");
      }
    };
    const dfs = (
      current: SVGGraphicsElement,
      matrix: DOMMatrix,
      fill: string,
      stroke: string,
    ) => {
      for (let i = 0; i < current.transform.baseVal.length; i++) {
        // Skip root's second-to-last transform: adjustMath appends
        // scale(0.8) translate(-ibbox.x, 0) there, and the 0.8 is
        // already baked into initialMatrix via bbox.width / ibbox.width.
        if (current === root && i === current.transform.baseVal.length - 2)
          continue;
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
      if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use")
        text.push(extract(current));
      for (let i = 0; i < current.children.length; i++)
        dfs(current.children[i] as SVGGraphicsElement);
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
      if (style.fill !== "default")
        current.setAttribute("fill", C.toString(style.fill));
      if (style.stroke !== "default")
        current.setAttribute("stroke", C.toString(style.stroke));
      if (i + 1 < styles.length) i++;
    };
    const dfs = (current: SVGGraphicsElement) => {
      if (!Dom.tagName(current)) return;
      if (Dom.tagName(current) === "defs") return;
      if (Dom.tagName(current) === "path") return;
      if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use")
        apply(current);
      for (let i = 0; i < current.children.length; i++)
        dfs(current.children[i] as SVGGraphicsElement);
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

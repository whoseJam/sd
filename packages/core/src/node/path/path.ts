import type { AABB } from "@/math/aabb";
import type { SDFilter } from "@/node/filter/filter";
import type { TransformOrigin } from "@/node/node";
import type { Group } from "@/node/other/group";
import type { BasePathAttributes } from "@/node/path/base-path";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Filter } from "@/node/filter/filter";
import { BasePath } from "@/node/path/base-path";
import { PathEngine } from "@/node/path/path-engine";
import { SDSVGNode } from "@/node/svg-node";
import { Color as C } from "@/utility/color";

export type PathAttributes = BasePathAttributes & {
  d: string;
};

// Local box is derived from d and cached after each update so getLocalBox stays O(1).
export class Path extends BasePath {
  declare attributes: PathAttributes;
  protected box: AABB = { x: 0, y: 0, width: 0, height: 0 };

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

    const d = args?.d ?? "";
    this.attributes = {
      ...this.attributes,
      transformOrigin: args?.transformOrigin ?? ["center", "center"],
      translate: args?.translate ?? [0, 0],
      rotate: args?.rotate ?? 0,
      scale: args?.scale ?? [1, 1],
      opacity: args?.opacity ?? 1,
      fill: C.toRGBA(C.toFill(args?.fill ?? C.none)),
      stroke: C.toRGBA(C.toStroke(args?.stroke ?? C.black)),
      fillOpacity: args?.fillOpacity ?? 1,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(
        args?.strokeDashArray ?? args?.strokeDasharray,
      ),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      d,
    };
    const box = PathEngine.toBox(d);
    this.box = {
      x: box.x ?? 0,
      y: box.y ?? 0,
      width: box.width ?? 0,
      height: box.height ?? 0,
    };

    this.createSVGNode("path", {
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
  }

  getLocalBox(): AABB {
    return this.box;
  }

  // SVG isPointInFill works on the rendered element, whose y is flipped.
  // We pass the renderer-flipped point so the test matches what the user sees.
  protected containsLocalPoint(p: [number, number]): boolean {
    const element = this.renderer?.element() as SVGGeometryElement | undefined;
    if (!element || typeof element.isPointInFill !== "function") {
      return super.containsLocalPoint(p);
    }
    const svgRoot = element.ownerSVGElement;
    if (!svgRoot) return super.containsLocalPoint(p);
    const pt = svgRoot.createSVGPoint();
    pt.x = p[0];
    pt.y = -p[1];
    return element.isPointInFill(pt);
  }

  getPointAtRate(k: number): [number, number] {
    const [x, y] = PathEngine.getPointByRate(PathEngine.flipY(this.d), k);
    return [x, -y];
  }

  getPointAtLength(length: number): [number, number] {
    const [x, y] = PathEngine.getPointAtLength(
      PathEngine.flipY(this.d),
      length,
    );
    return [x, -y];
  }

  totalLength() {
    return PathEngine.getTotalLength(PathEngine.flipY(this.d));
  }

  get d(): string {
    return this.attributes.d;
  }

  set d(v: string) {
    const old = this.attributes.d;
    const box = PathEngine.toBox(v);
    this.box = {
      x: box.x ?? 0,
      y: box.y ?? 0,
      width: box.width ?? 0,
      height: box.height ?? 0,
    };
    this.triggerAttributeChanged(this.renderer, "d", v, old, Interp.pathInterp);
  }

  getD(): string {
    return this.d;
  }

  setD(d: string): this {
    this.d = d;
    return this;
  }
}

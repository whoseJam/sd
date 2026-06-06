import { SDHTMLNode } from "@/node/html-node";
import { SDSVGNode } from "@/node/svg-node";

// Derived setters assume setX/setY are the source of truth. Subclasses whose
// reactive attribute is a center coordinate (Ellipse / Circle) override setCx
// / setCy to write that attribute directly; otherwise the inherited setCx
// would call this.setX which on those classes is itself defined via
// setCenterX, producing infinite recursion.

export abstract class BoxSVGNode extends SDSVGNode {
  abstract setX(v: number): this;
  abstract setY(v: number): this;

  setCx(cx: number): this {
    return this.setX(this.getLocalX() + cx - this.getLocalCenterX());
  }
  setCenterX(cx: number): this {
    return this.setCx(cx);
  }

  setCy(cy: number): this {
    return this.setY(this.getLocalY() + cy - this.getLocalCenterY());
  }
  setCenterY(cy: number): this {
    return this.setCy(cy);
  }

  setMaxX(maxX: number): this {
    return this.setX(maxX - this.getLocalWidth());
  }

  setMaxY(maxY: number): this {
    return this.setY(maxY - this.getLocalHeight());
  }

  setCenter(center: [number, number]): this;
  setCenter(cx: number, cy: number): this;
  setCenter(cx: number | [number, number], cy?: number): this {
    if (Array.isArray(cx)) return this.setCx(cx[0]).setCy(cx[1]);
    return this.setCx(cx).setCy(cy);
  }
}

export abstract class SizedBoxSVGNode extends BoxSVGNode {
  abstract setWidth(v: number): this;
  abstract setHeight(v: number): this;
}

export abstract class BoxHTMLNode extends SDHTMLNode {
  abstract setX(v: number): this;
  abstract setY(v: number): this;

  setCx(cx: number): this {
    return this.setX(this.getLocalX() + cx - this.getLocalCenterX());
  }
  setCenterX(cx: number): this {
    return this.setCx(cx);
  }

  setCy(cy: number): this {
    return this.setY(this.getLocalY() + cy - this.getLocalCenterY());
  }
  setCenterY(cy: number): this {
    return this.setCy(cy);
  }

  setMaxX(maxX: number): this {
    return this.setX(maxX - this.getLocalWidth());
  }

  setMaxY(maxY: number): this {
    return this.setY(maxY - this.getLocalHeight());
  }

  setCenter(center: [number, number]): this;
  setCenter(cx: number, cy: number): this;
  setCenter(cx: number | [number, number], cy?: number): this {
    if (Array.isArray(cx)) return this.setCx(cx[0]).setCy(cx[1]);
    return this.setCx(cx).setCy(cy);
  }
}

export abstract class SizedBoxHTMLNode extends BoxHTMLNode {
  abstract setWidth(v: number): this;
  abstract setHeight(v: number): this;
}

export type BoxNode = BoxSVGNode | BoxHTMLNode;
export type SizedBoxNode = SizedBoxSVGNode | SizedBoxHTMLNode;

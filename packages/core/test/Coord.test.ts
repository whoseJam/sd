import { describe, expect, it } from "vitest";
import { Circle } from "@/Node/Shape/Circle";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Rect } from "@/Node/Shape/Rect";
import { Image } from "@/Node/Shape/Image";
import { Polygon } from "@/Node/Shape/Polygon";
import { Line } from "@/Node/Path/Line";
import { Polyline } from "@/Node/Path/Polyline";
import type { SDNode } from "@/Node/SDNode";

// Tier 1: math→SVG coord consistency. Each shape stores math-space values in
// its typed fields and flips to SVG-space via renderAttribute when writing to
// the DOM. These tests pin that contract: getX/getY/etc return math values,
// while the underlying SVG element carries the flipped values.

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

describe("Circle", () => {
  it("flips cy on the DOM but keeps math cy on the model", () => {
    const c = new Circle({ cx: 100, cy: 50, r: 10 });
    expect(attr(c, "cx")).toBe("100");
    expect(attr(c, "cy")).toBe("-50");
    expect(c.getCy()).toBe(50);
  });
});

describe("Ellipse", () => {
  it("flips cy on the DOM but keeps math cy on the model", () => {
    const e = new Ellipse({ cx: 100, cy: 50, rx: 20, ry: 10 });
    expect(attr(e, "cx")).toBe("100");
    expect(attr(e, "cy")).toBe("-50");
    expect(e.getCy()).toBe(50);
  });
});

describe("Rect", () => {
  it("anchors at math bottom-left and flips top-left to SVG y = -(y + height)", () => {
    const r = new Rect({ x: 10, y: 20, width: 30, height: 40 });
    expect(attr(r, "x")).toBe("10");
    expect(attr(r, "y")).toBe(String(-(20 + 40)));
    expect(r.getY()).toBe(20);
  });
});

describe("Image", () => {
  it("flips top-left y the same way Rect does", () => {
    const i = new Image({ x: 10, y: 20, width: 30, height: 40, src: "" });
    expect(attr(i, "x")).toBe("10");
    expect(attr(i, "y")).toBe(String(-(20 + 40)));
  });
});

describe("Line", () => {
  it("flips y1 and y2 independently", () => {
    const l = new Line({ x1: 0, y1: 10, x2: 50, y2: 30 });
    expect(attr(l, "x1")).toBe("0");
    expect(attr(l, "x2")).toBe("50");
    expect(attr(l, "y1")).toBe("-10");
    expect(attr(l, "y2")).toBe("-30");
  });
});

describe("Polyline", () => {
  it("flips y on each point", () => {
    const p = new Polyline({
      points: [
        [0, 10],
        [20, 30],
      ],
    });
    expect(attr(p, "points")).toBe("0,-10,20,-30");
  });
});

describe("Polygon", () => {
  it("flips y on each point", () => {
    const p = new Polygon({
      points: [
        [0, 10],
        [20, 30],
        [40, 50],
      ],
    });
    expect(attr(p, "points")).toBe("0,-10,20,-30,40,-50");
  });
});

import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Circle } from "@/Node/Shape/Circle";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Covers construction-time DOM (math→SVG flip) and the model/listener
// contract of subsequent mutations. The mutation→DOM tier (assert DOM
// after Animate.forceToFinish) is deliberately skipped: the correct
// approach is to drive the Animate timeline and flush it, but
// createSVGNode currently fires accessor setters during construction
// before this.renderer is assigned, queuing bogus Actions that crash
// on flush. Add that tier once createSVGNode separates model init from
// DOM paint.
describe("Circle", () => {
  describe("construction", () => {
    it("flips cy on the DOM but keeps math cy on the model", () => {
      const c = new Circle({ cx: 100, cy: 50, r: 10 });
      expect(attr(c, "cx")).toBe("100");
      expect(attr(c, "cy")).toBe("-50");
      expect(c.getCy()).toBe(50);
    });
  });

  describe("cx", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCxChanged((vn, vo) => seen.push([vn, vo]));

      c.cx = 42;

      expect(c.attributes.cx).toBe(42);
      expect(c.cx).toBe(42);
      expect(c.getCx()).toBe(42);
      expect(seen).toEqual([[42, 0]]);
    });

    it("c.cx = v and c.setCx(v) reach the same model state", () => {
      const a = new Circle({ cx: 5 });
      const b = new Circle({ cx: 5 });
      a.cx = 7;
      b.setCx(7);
      expect(a.attributes.cx).toBe(b.attributes.cx);
      expect(a.cx).toBe(b.cx);
    });
  });

  describe("cy", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCyChanged((vn, vo) => seen.push([vn, vo]));

      c.cy = 30;

      expect(c.attributes.cy).toBe(30);
      expect(seen).toEqual([[30, 0]]);
    });
  });

  describe("r", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new Circle({ r: 10 });
      const seen: Array<[number, number]> = [];
      c.onRChanged((vn, vo) => seen.push([vn, vo]));

      c.r = 25;

      expect(c.attributes.r).toBe(25);
      expect(seen).toEqual([[25, 10]]);
    });
  });
});

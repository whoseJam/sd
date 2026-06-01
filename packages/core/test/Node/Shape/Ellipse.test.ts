import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Animate } from "@/Animate/Animate";
import { Ellipse } from "@/Node/Shape/Ellipse";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);
describe("Ellipse", () => {
  describe("construction", () => {
    it("flips cy on the DOM but keeps math cy on the model", () => {
      const e = new Ellipse({ cx: 100, cy: 50, rx: 20, ry: 10 });
      expect(attr(e, "cx")).toBe("100");
      expect(attr(e, "cy")).toBe("-50");
      expect(e.getCy()).toBe(50);
    });
  });

  describe("cx", () => {
    it("setter updates attributes and fires listener", () => {
      const e = new Ellipse({ cx: 0 });
      const seen: Array<[number, number]> = [];
      e.onCxChanged((vn, vo) => seen.push([vn, vo]));

      e.cx = 42;

      expect(e.attributes.cx).toBe(42);
      expect(e.cx).toBe(42);
      expect(e.getCx()).toBe(42);
      expect(seen).toEqual([[42, 0]]);
    });

    it("e.cx = v and e.setCx(v) reach the same model state", () => {
      const a = new Ellipse({ cx: 5 });
      const b = new Ellipse({ cx: 5 });
      a.cx = 7;
      b.setCx(7);
      expect(a.attributes.cx).toBe(b.attributes.cx);
      expect(a.cx).toBe(b.cx);
    });
  });

  describe("cy", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const e = new Ellipse({ cy: 0 });
      const seen: Array<[number, number]> = [];
      e.onCyChanged((vn, vo) => seen.push([vn, vo]));

      e.cy = 30;

      expect(e.attributes.cy).toBe(30);
      expect(seen).toEqual([[30, 0]]);
    });

    it("setter flips DOM cy sign after animation flush", () => {
      const e = new Ellipse({ cy: 0 });
      e.cy = 30;
      Animate.forceToFinish();
      expect(attr(e, "cy")).toBe("-30");
    });
  });

  describe("rx", () => {
    it("setter updates attributes and fires listener", () => {
      const e = new Ellipse({ rx: 20 });
      const seen: Array<[number, number]> = [];
      e.onRxChanged((vn, vo) => seen.push([vn, vo]));

      e.rx = 35;

      expect(e.attributes.rx).toBe(35);
      expect(seen).toEqual([[35, 20]]);
    });
  });

  describe("ry", () => {
    it("setter updates attributes and fires listener", () => {
      const e = new Ellipse({ ry: 20 });
      const seen: Array<[number, number]> = [];
      e.onRyChanged((vn, vo) => seen.push([vn, vo]));

      e.ry = 15;

      expect(e.attributes.ry).toBe(15);
      expect(seen).toEqual([[15, 20]]);
    });
  });
});

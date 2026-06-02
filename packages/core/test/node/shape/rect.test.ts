import { describe, expect, it } from "vitest";

import type { SDNode } from "@/node/node";

import { Animate } from "@/animate/animate";
import { Rect } from "@/node/shape/rect";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);
describe("Rect", () => {
  describe("construction", () => {
    it("anchors at math bottom-left and flips top-left to SVG y = -(y + height)", () => {
      const r = new Rect({ x: 10, y: 20, width: 30, height: 40 });
      expect(attr(r, "x")).toBe("10");
      expect(attr(r, "y")).toBe(String(-(20 + 40)));
      expect(r.getY()).toBe(20);
    });
  });

  describe("x", () => {
    it("setter updates attributes and fires listener", () => {
      const r = new Rect({ x: 0 });
      const seen: Array<[number, number]> = [];
      r.onXChanged((vn, vo) => seen.push([vn, vo]));

      r.x = 17;

      expect(r.attributes.x).toBe(17);
      expect(r.x).toBe(17);
      expect(r.getX()).toBe(17);
      expect(seen).toEqual([[17, 0]]);
    });

    it("r.x = v and r.setX(v) reach the same model state", () => {
      const a = new Rect({ x: 5 });
      const b = new Rect({ x: 5 });
      a.x = 9;
      b.setX(9);
      expect(a.attributes.x).toBe(b.attributes.x);
    });
  });

  describe("y", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const r = new Rect({ y: 0, height: 40 });
      const seen: Array<[number, number]> = [];
      r.onYChanged((vn, vo) => seen.push([vn, vo]));

      r.y = 25;

      expect(r.attributes.y).toBe(25);
      expect(seen).toEqual([[25, 0]]);
    });

    it("setter flips DOM y to -(y + height) after animation flush", () => {
      const r = new Rect({ y: 0, height: 40 });
      r.y = 25;
      Animate.forceToFinish();
      expect(attr(r, "y")).toBe(String(-(25 + 40)));
    });
  });

  describe("width", () => {
    it("setter updates attributes and fires listener", () => {
      const r = new Rect({ width: 40 });
      const seen: Array<[number, number]> = [];
      r.onWidthChanged((vn, vo) => seen.push([vn, vo]));

      r.width = 60;

      expect(r.attributes.width).toBe(60);
      expect(seen).toEqual([[60, 40]]);
    });
  });

  describe("height", () => {
    // Tier 4: height change triggers a y re-fire so renderAttribute can
    // recompute svg_y = -(y + height) with the new height. Without this
    // the math-y anchor would visibly drift on height changes.
    it("setter fires height listener and re-fires y with unchanged math value", () => {
      const r = new Rect({ y: 10, height: 40 });
      const heightSeen: Array<[number, number]> = [];
      const ySeen: Array<[number, number]> = [];
      r.onHeightChanged((vn, vo) => heightSeen.push([vn, vo]));
      r.onYChanged((vn, vo) => ySeen.push([vn, vo]));

      r.height = 70;

      expect(r.attributes.height).toBe(70);
      expect(heightSeen).toEqual([[70, 40]]);
      // y is re-fired with the same value so renderAttribute re-runs
      expect(ySeen).toEqual([[10, 10]]);
    });

    it("DOM y recomputes with new height after flush", () => {
      const r = new Rect({ y: 10, height: 40 });
      expect(attr(r, "y")).toBe(String(-(10 + 40)));
      r.height = 70;
      Animate.forceToFinish();
      expect(attr(r, "height")).toBe("70");
      expect(attr(r, "y")).toBe(String(-(10 + 70)));
    });
  });

  describe("rx", () => {
    it("setter updates attributes and fires listener", () => {
      const r = new Rect({ rx: 0 });
      const seen: Array<[number, number]> = [];
      r.onRxChanged((vn, vo) => seen.push([vn, vo]));

      r.rx = 4;

      expect(r.attributes.rx).toBe(4);
      expect(seen).toEqual([[4, 0]]);
    });
  });

  describe("ry", () => {
    it("setter updates attributes and fires listener", () => {
      const r = new Rect({ ry: 0 });
      const seen: Array<[number, number]> = [];
      r.onRyChanged((vn, vo) => seen.push([vn, vo]));

      r.ry = 6;

      expect(r.attributes.ry).toBe(6);
      expect(seen).toEqual([[6, 0]]);
    });
  });
});

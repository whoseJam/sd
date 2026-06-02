import { describe, expect, it } from "vitest";

import type { SDNode } from "@/node/node";

import { Animate } from "@/animate/animate";
import { Line } from "@/node/path/line";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);
describe("Line", () => {
  describe("construction", () => {
    it("flips y1 and y2 independently", () => {
      const l = new Line({ x1: 0, y1: 10, x2: 50, y2: 30 });
      expect(attr(l, "x1")).toBe("0");
      expect(attr(l, "x2")).toBe("50");
      expect(attr(l, "y1")).toBe("-10");
      expect(attr(l, "y2")).toBe("-30");
    });
  });

  describe("x1", () => {
    it("setter updates attributes and fires listener", () => {
      const l = new Line({ x1: 0 });
      const seen: Array<[number, number]> = [];
      l.onX1Changed((vn, vo) => seen.push([vn, vo]));

      l.x1 = 17;

      expect(l.attributes.x1).toBe(17);
      expect(l.x1).toBe(17);
      expect(l.getX1()).toBe(17);
      expect(seen).toEqual([[17, 0]]);
    });

    it("l.x1 = v and l.setX1(v) reach the same model state", () => {
      const a = new Line({ x1: 5 });
      const b = new Line({ x1: 5 });
      a.x1 = 9;
      b.setX1(9);
      expect(a.attributes.x1).toBe(b.attributes.x1);
    });
  });

  describe("y1", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const l = new Line({ y1: 0 });
      const seen: Array<[number, number]> = [];
      l.onY1Changed((vn, vo) => seen.push([vn, vo]));

      l.y1 = 25;

      expect(l.attributes.y1).toBe(25);
      expect(seen).toEqual([[25, 0]]);
    });

    it("setter flips DOM y1 sign after animation flush", () => {
      const l = new Line({ y1: 0 });
      l.y1 = 25;
      Animate.forceToFinish();
      expect(attr(l, "y1")).toBe("-25");
    });
  });

  describe("x2", () => {
    it("setter updates attributes and fires listener", () => {
      const l = new Line({ x2: 40 });
      const seen: Array<[number, number]> = [];
      l.onX2Changed((vn, vo) => seen.push([vn, vo]));

      l.x2 = 60;

      expect(l.attributes.x2).toBe(60);
      expect(seen).toEqual([[60, 40]]);
    });
  });

  describe("y2", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const l = new Line({ y2: 40 });
      const seen: Array<[number, number]> = [];
      l.onY2Changed((vn, vo) => seen.push([vn, vo]));

      l.y2 = 60;

      expect(l.attributes.y2).toBe(60);
      expect(seen).toEqual([[60, 40]]);
    });
  });
});

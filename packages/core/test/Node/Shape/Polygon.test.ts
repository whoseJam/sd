import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Polygon } from "@/Node/Shape/Polygon";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Covers construction-time DOM (per-point math→SVG y flip) and the
// model/listener contract of mutations. mutation→DOM tier deferred —
// see Circle.test.ts.
describe("Polygon", () => {
  describe("construction", () => {
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

  describe("points", () => {
    it("setter updates attributes and fires listener", () => {
      const p = new Polygon({
        points: [
          [0, 0],
          [10, 0],
        ],
      });
      const seen: Array<[Array<[number, number]>, Array<[number, number]>]> =
        [];
      p.onPointsChanged((vn, vo) => seen.push([vn, vo]));

      const next: Array<[number, number]> = [
        [0, 0],
        [10, 0],
        [10, 10],
      ];
      p.points = next;

      expect(p.attributes.points).toEqual(next);
      expect(p.points).toEqual(next);
      expect(p.getPoints()).toEqual(next);
      expect(seen).toEqual([
        [
          next,
          [
            [0, 0],
            [10, 0],
          ],
        ],
      ]);
    });

    it("p.points = v and p.setPoints(v) reach the same model state", () => {
      const base: Array<[number, number]> = [
        [0, 0],
        [5, 5],
      ];
      const next: Array<[number, number]> = [
        [1, 1],
        [6, 6],
      ];
      const a = new Polygon({ points: base });
      const b = new Polygon({ points: base });
      a.points = next;
      b.setPoints(next);
      expect(a.attributes.points).toEqual(b.attributes.points);
    });
  });
});

import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Animate } from "@/Animate/Animate";
import { Polyline } from "@/Node/Path/Polyline";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);
describe("Polyline", () => {
  describe("construction", () => {
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

  describe("points", () => {
    it("setter updates attributes and fires listener", () => {
      const p = new Polyline({
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
      const a = new Polyline({ points: base });
      const b = new Polyline({ points: base });
      a.points = next;
      b.setPoints(next);
      expect(a.attributes.points).toEqual(b.attributes.points);
    });

    it("setter flips y per-point on DOM after animation flush", () => {
      const p = new Polyline({
        points: [
          [0, 0],
          [10, 0],
        ],
      });
      p.points = [
        [0, 5],
        [10, 15],
      ];
      Animate.forceToFinish();
      expect(attr(p, "points")).toBe("0,-5,10,-15");
    });
  });
});

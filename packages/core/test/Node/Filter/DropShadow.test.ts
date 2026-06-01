import { describe, expect, it } from "vitest";

import { DropShadow } from "@/Node/Filter/DropShadow";
import { Color as C } from "@/Utility/Color";

// Filter primitives don't position in user math space, so there's no
// math→SVG flip to assert. Tests cover construction defaults + the
// model/listener contract on mutations. mutation→DOM tier deferred —
// see Circle.test.ts.
describe("DropShadow", () => {
  describe("construction", () => {
    it("normalizes scalar stdDeviation to a 2-tuple", () => {
      const d = new DropShadow({ stdDeviation: 3 });
      expect(d.attributes.stdDeviation).toEqual([3, 3]);
    });

    it("stores the tuple form unchanged", () => {
      const d = new DropShadow({ stdDeviation: [2, 5] });
      expect(d.attributes.stdDeviation).toEqual([2, 5]);
    });

    it("normalizes floodColor to RGBA", () => {
      const d = new DropShadow({ floodColor: C.red });
      expect(d.attributes.floodColor).toEqual(C.toRGBA(C.red));
    });
  });

  describe("dx", () => {
    it("setter updates attributes and fires listener", () => {
      const d = new DropShadow({ dx: 0 });
      const seen: Array<[number, number]> = [];
      d.onDxChanged((vn, vo) => seen.push([vn, vo]));

      d.dx = 7;

      expect(d.attributes.dx).toBe(7);
      expect(d.dx).toBe(7);
      expect(d.getDx()).toBe(7);
      expect(seen).toEqual([[7, 0]]);
    });

    it("d.dx = v and d.setDx(v) reach the same model state", () => {
      const a = new DropShadow({ dx: 1 });
      const b = new DropShadow({ dx: 1 });
      a.dx = 4;
      b.setDx(4);
      expect(a.attributes.dx).toBe(b.attributes.dx);
    });
  });

  describe("dy", () => {
    it("setter updates attributes and fires listener", () => {
      const d = new DropShadow({ dy: 0 });
      const seen: Array<[number, number]> = [];
      d.onDyChanged((vn, vo) => seen.push([vn, vo]));

      d.dy = 5;

      expect(d.attributes.dy).toBe(5);
      expect(seen).toEqual([[5, 0]]);
    });
  });

  describe("stdDeviation", () => {
    it("setter accepts tuple, updates attributes and fires listener", () => {
      const d = new DropShadow({ stdDeviation: [2, 2] });
      const seen: Array<[[number, number], [number, number]]> = [];
      d.onStdDeviationChanged((vn, vo) => seen.push([vn, vo]));

      d.stdDeviation = [4, 6];

      expect(d.attributes.stdDeviation).toEqual([4, 6]);
      expect(seen).toEqual([
        [
          [4, 6],
          [2, 2],
        ],
      ]);
    });

    it("setStdDeviation accepts a scalar and normalizes to tuple", () => {
      const d = new DropShadow({ stdDeviation: [1, 1] });
      d.setStdDeviation(5);
      expect(d.attributes.stdDeviation).toEqual([5, 5]);
    });
  });

  describe("floodColor", () => {
    it("setFloodColor normalizes to RGBA before writing", () => {
      const d = new DropShadow({ floodColor: C.black });
      d.setFloodColor(C.red);
      expect(d.attributes.floodColor).toEqual(C.toRGBA(C.red));
    });
  });

  describe("floodOpacity", () => {
    it("setter updates attributes and fires listener", () => {
      const d = new DropShadow({ floodOpacity: 1 });
      const seen: Array<[number, number]> = [];
      d.onFloodOpacityChanged((vn, vo) => seen.push([vn, vo]));

      d.floodOpacity = 0.5;

      expect(d.attributes.floodOpacity).toBe(0.5);
      expect(seen).toEqual([[0.5, 1]]);
    });
  });
});

import { describe, expect, it } from "vitest";

import { GaussianBlur } from "@/Node/Filter/GaussianBlur";

describe("GaussianBlur", () => {
  describe("construction", () => {
    it("normalizes scalar stdDeviation to a 2-tuple", () => {
      const g = new GaussianBlur({ stdDeviation: 4 });
      expect(g.attributes.stdDeviation).toEqual([4, 4]);
    });

    it("stores the tuple form unchanged", () => {
      const g = new GaussianBlur({ stdDeviation: [2, 8] });
      expect(g.attributes.stdDeviation).toEqual([2, 8]);
    });
  });

  describe("stdDeviation", () => {
    it("setter updates attributes and fires listener", () => {
      const g = new GaussianBlur({ stdDeviation: [1, 1] });
      const seen: Array<[[number, number], [number, number]]> = [];
      g.onStdDeviationChanged((vn, vo) => seen.push([vn, vo]));

      g.stdDeviation = [3, 7];

      expect(g.attributes.stdDeviation).toEqual([3, 7]);
      expect(seen).toEqual([
        [
          [3, 7],
          [1, 1],
        ],
      ]);
    });

    it("setStdDeviation accepts a scalar and normalizes to tuple", () => {
      const g = new GaussianBlur({ stdDeviation: [1, 1] });
      g.setStdDeviation(9);
      expect(g.attributes.stdDeviation).toEqual([9, 9]);
    });
  });
});

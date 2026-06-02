import { describe, expect, it } from "vitest";

import type { PathOpers } from "@/node/path/path-engine";

import { PathEngine } from "@/node/path/path-engine";

const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

const expectClose = (got: number, want: number, label = "") => {
  if (!close(got, want)) {
    throw new Error(`${label}: expected ${want} got ${got}`);
  }
};

const expectOpClose = (got: PathOpers[number], want: PathOpers[number]) => {
  expect(got[0]).toBe(want[0]);
  expect(got.length).toBe(want.length);
  for (let i = 1; i < got.length; i++) {
    expectClose(got[i] as number, want[i] as number, `arg ${i}`);
  }
};

describe("PathEngine.toCubic", () => {
  describe("M and L (degenerate cubics)", () => {
    it("preserves M and turns L into a flat cubic with control points at endpoints", () => {
      const out = PathEngine.toCubic("M 0 0 L 10 20");
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 0, 0, 10, 20, 10, 20],
      ]);
    });

    it("lifts relative l to absolute", () => {
      const out = PathEngine.toCubic("M 5 5 l 3 4");
      expect(out).toEqual([
        ["M", 5, 5],
        ["C", 5, 5, 8, 9, 8, 9],
      ]);
    });

    it("uses subpath start for Z", () => {
      const out = PathEngine.toCubic("M 0 0 L 10 0 Z");
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 0, 0, 10, 0, 10, 0],
        ["C", 10, 0, 0, 0, 0, 0],
      ]);
    });
  });

  describe("H / V", () => {
    it("H keeps the current y", () => {
      const out = PathEngine.toCubic("M 0 5 H 10");
      expect(out).toEqual([
        ["M", 0, 5],
        ["C", 0, 5, 10, 5, 10, 5],
      ]);
    });

    it("V keeps the current x", () => {
      const out = PathEngine.toCubic("M 3 0 V 10");
      expect(out).toEqual([
        ["M", 3, 0],
        ["C", 3, 0, 3, 10, 3, 10],
      ]);
    });
  });

  describe("C and S", () => {
    it("C passes through unchanged", () => {
      const out = PathEngine.toCubic("M 0 0 C 1 2 3 4 5 6");
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
      ]);
    });

    it("S reflects the previous C control point", () => {
      const out = PathEngine.toCubic("M 0 0 C 1 2 3 4 5 6 S 7 8 9 10");
      // Reflection of (3, 4) about (5, 6) is (7, 8).
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
        ["C", 7, 8, 7, 8, 9, 10],
      ]);
    });

    it("S without a preceding C uses the current point as the reflected control", () => {
      const out = PathEngine.toCubic("M 0 0 S 1 2 3 4");
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 0, 0, 1, 2, 3, 4],
      ]);
    });
  });

  describe("Q and T", () => {
    it("Q converts to cubic with 2/3 control rule", () => {
      const out = PathEngine.toCubic("M 0 0 Q 6 0 6 6");
      // c1 = (0,0) + 2/3 * ((6,0) - (0,0)) = (4, 0)
      // c2 = (6,6) + 2/3 * ((6,0) - (6,6)) = (6, 2)
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 4, 0, 6, 2, 6, 6],
      ]);
    });

    it("T reflects the previous Q control point", () => {
      const out = PathEngine.toCubic("M 0 0 Q 6 0 6 6 T 12 6");
      // Reflection of (6, 0) about (6, 6) is (6, 12).
      // So implied Q is (6, 12) target (12, 6).
      // c1 = (6,6) + 2/3 * ((6,12) - (6,6)) = (6, 10)
      // c2 = (12,6) + 2/3 * ((6,12) - (12,6)) = (8, 10)
      const expected: PathOpers = [
        ["M", 0, 0],
        ["C", 4, 0, 6, 2, 6, 6],
        ["C", 6, 10, 8, 10, 12, 6],
      ];
      out.forEach((op, i) => expectOpClose(op, expected[i]));
    });
  });

  describe("A (arc)", () => {
    it("returns at least one cubic and lands on the endpoint", () => {
      const out = PathEngine.toCubic("M 0 0 A 5 5 0 0 1 10 0");
      expect(out[0]).toEqual(["M", 0, 0]);
      expect(out.length).toBeGreaterThanOrEqual(2);
      const last = out[out.length - 1];
      expectClose(last[last.length - 2] as number, 10);
      expectClose(last[last.length - 1] as number, 0);
    });

    it("zero radius collapses to a straight cubic line", () => {
      const out = PathEngine.toCubic("M 0 0 A 0 0 0 0 1 5 5");
      expect(out).toEqual([
        ["M", 0, 0],
        ["C", 0, 0, 5, 5, 5, 5],
      ]);
    });
  });

  describe("relative commands", () => {
    it("m / l / c / s / q / t all lift to absolute", () => {
      const out = PathEngine.toCubic("m 5 5 l 3 4 c 1 1 2 2 3 3");
      expect(out[0]).toEqual(["M", 5, 5]);
      expect(out[1]).toEqual(["C", 5, 5, 8, 9, 8, 9]);
      // c relative to (8, 9): control1 (9, 10), control2 (10, 11), end (11, 12)
      expect(out[2]).toEqual(["C", 9, 10, 10, 11, 11, 12]);
    });
  });
});

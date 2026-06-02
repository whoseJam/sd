import { describe, expect, it } from "vitest";

import { PathEngine } from "@/node/path/path-engine";

describe("PathEngine.toCubics", () => {
  it("matches counts when both already align", () => {
    const [a, b] = PathEngine.toCubics("M 0 0 L 10 0", "M 0 0 L 20 0");
    expect(a.length).toBe(b.length);
    expect(a.length).toBe(2);
  });

  it("splits the shorter to match the longer", () => {
    const [a, b] = PathEngine.toCubics(
      "M 0 0 L 10 0",
      "M 0 0 L 5 0 L 10 0 L 15 0",
    );
    expect(a.length).toBe(b.length);
    expect(a.length).toBe(4);
  });

  it("preserves the original endpoint of the split cubic", () => {
    // a has one segment from (0,0) to (10, 0). After splits it must
    // still end at (10, 0).
    const [a] = PathEngine.toCubics("M 0 0 L 10 0", "M 0 0 L 1 0 L 2 0 L 3 0");
    const last = a[a.length - 1];
    expect(last[5]).toBe(10);
    expect(last[6]).toBe(0);
  });

  it("splitting a degenerate line keeps midpoint at the geometric middle", () => {
    // L 0 0 → 10 0 is a degenerate cubic with all control points
    // collinear on the line. Splitting at t=0.5 must yield midpoint (5, 0).
    const [a] = PathEngine.toCubics("M 0 0 L 10 0", "M 0 0 L 0 0 L 0 0");
    expect(a.length).toBe(3);
    expect(a[1][5]).toBe(5);
    expect(a[1][6]).toBe(0);
  });

  it("does not infinite-loop when both paths are M only", () => {
    const [a, b] = PathEngine.toCubics("M 0 0", "M 1 1");
    expect(a.length).toBe(1);
    expect(b.length).toBe(1);
  });

  it("returns aligned outputs that start with M", () => {
    const [a, b] = PathEngine.toCubics("M 0 0 L 10 0 L 10 10", "M 1 1 L 5 5");
    expect(a[0][0]).toBe("M");
    expect(b[0][0]).toBe("M");
    expect(a.length).toBe(b.length);
  });
});

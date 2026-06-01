import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Line } from "@/Node/Path/Line";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Line is not yet on the Phase 3 attributes+accessor pattern, so this
// file only covers the construction-time math→SVG flip for now.
// Mutation / listener tiers come with the Line conversion.
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
});

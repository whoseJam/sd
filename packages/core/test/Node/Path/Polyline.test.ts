import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Polyline } from "@/Node/Path/Polyline";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Polyline is not yet on the Phase 3 attributes+accessor pattern, so
// this file only covers the construction-time math→SVG flip for now.
// Mutation / listener tiers come with the Polyline conversion.
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
});

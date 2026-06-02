import { describe, expect, it } from "vitest";

import { Animate } from "@/animate/animate";
import { Composite } from "@/node/filter/composite";

const el = (n: Composite) => (n as any).renderer.element() as SVGElement;
const attr = (n: Composite, k: string) => el(n).getAttribute(k);

describe("Composite", () => {
  describe("operator", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new Composite({ operator: "over" });
      const seen: Array<[string, string]> = [];
      c.onOperatorChanged((vn, vo) => seen.push([vn, vo]));

      c.operator = "arithmetic";

      expect(c.attributes.operator).toBe("arithmetic");
      expect(seen).toEqual([["arithmetic", "over"]]);
    });
  });

  describe("k1", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new Composite({ k1: 0 });
      const seen: Array<[number, number]> = [];
      c.onK1Changed((vn, vo) => seen.push([vn, vo]));

      c.k1 = 0.5;

      expect(c.attributes.k1).toBe(0.5);
      expect(seen).toEqual([[0.5, 0]]);
    });
  });

  describe("k2 / k3 / k4", () => {
    it("each setter updates attributes and fires its own listener", () => {
      const c = new Composite();

      c.k2 = 1;
      c.k3 = 2;
      c.k4 = 3;

      expect(c.attributes.k2).toBe(1);
      expect(c.attributes.k3).toBe(2);
      expect(c.attributes.k4).toBe(3);
    });
  });

  it("operator / k* setters write DOM after animation flush", () => {
    const c = new Composite({ operator: "over", k1: 0 });
    c.operator = "arithmetic";
    c.k1 = 0.5;
    Animate.forceToFinish();
    expect(attr(c, "operator")).toBe("arithmetic");
    expect(attr(c, "k1")).toBe("0.5");
  });
});

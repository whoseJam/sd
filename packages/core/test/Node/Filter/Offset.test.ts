import { describe, expect, it } from "vitest";

import { Animate } from "@/Animate/Animate";
import { Offset } from "@/Node/Filter/Offset";

const el = (n: Offset) => (n as any).renderer.element() as SVGElement;
const attr = (n: Offset, k: string) => el(n).getAttribute(k);

describe("Offset", () => {
  describe("dx", () => {
    it("setter updates attributes and fires listener", () => {
      const o = new Offset({ dx: 0 });
      const seen: Array<[number, number]> = [];
      o.onDxChanged((vn, vo) => seen.push([vn, vo]));

      o.dx = 5;

      expect(o.attributes.dx).toBe(5);
      expect(o.dx).toBe(5);
      expect(o.getDx()).toBe(5);
      expect(seen).toEqual([[5, 0]]);
    });

    it("o.dx = v and o.setDx(v) reach the same model state", () => {
      const a = new Offset({ dx: 2 });
      const b = new Offset({ dx: 2 });
      a.dx = 7;
      b.setDx(7);
      expect(a.attributes.dx).toBe(b.attributes.dx);
    });
  });

  describe("dy", () => {
    it("setter updates attributes and fires listener", () => {
      const o = new Offset({ dy: 0 });
      const seen: Array<[number, number]> = [];
      o.onDyChanged((vn, vo) => seen.push([vn, vo]));

      o.dy = 3;

      expect(o.attributes.dy).toBe(3);
      expect(seen).toEqual([[3, 0]]);
    });
  });

  it("dx / dy setters write DOM after animation flush", () => {
    const o = new Offset({ dx: 0, dy: 0 });
    o.dx = 5;
    o.dy = 8;
    Animate.forceToFinish();
    expect(attr(o, "dx")).toBe("5");
    expect(attr(o, "dy")).toBe("8");
  });
});

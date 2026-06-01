import { describe, expect, it } from "vitest";

import { Animate } from "@/Animate/Animate";
import { Filter } from "@/Node/Filter/Filter";

const el = (n: Filter) => (n as any).renderer.element() as SVGElement;
const attr = (n: Filter, k: string) => el(n).getAttribute(k);

describe("Filter", () => {
  describe("construction", () => {
    it("defaults to a -10% / 120% padding region", () => {
      const f = new Filter();
      expect(f.attributes.id).toBe("");
      expect(f.attributes.x).toBe("-10%");
      expect(f.attributes.y).toBe("-10%");
      expect(f.attributes.width).toBe("120%");
      expect(f.attributes.height).toBe("120%");
    });

    it("uses the supplied id and region", () => {
      const f = new Filter({
        id: "shadow",
        x: "0%",
        y: "0%",
        width: "100%",
        height: "100%",
      });
      expect(f.attributes.id).toBe("shadow");
      expect(f.attributes.x).toBe("0%");
    });
  });

  describe("id", () => {
    it("setter updates attributes and fires listener", () => {
      const f = new Filter({ id: "a" });
      const seen: Array<[string, string]> = [];
      f.onAttributeChanged("id", (vn: string, vo: string) =>
        seen.push([vn, vo]),
      );

      f.id = "b";

      expect(f.attributes.id).toBe("b");
      expect(f.id).toBe("b");
      expect(f.getId()).toBe("b");
      expect(seen).toEqual([["b", "a"]]);
    });

    it("f.id = v and f.setId(v) reach the same model state", () => {
      const a = new Filter({ id: "base" });
      const b = new Filter({ id: "base" });
      a.id = "next";
      b.setId("next");
      expect(a.attributes.id).toBe(b.attributes.id);
    });

    it("toURLString returns url(#id)", () => {
      const f = new Filter({ id: "glow" });
      expect(Filter.toURLString(f)).toBe("url(#glow)");
    });

    it("setter writes DOM id after animation flush", () => {
      const f = new Filter({ id: "before" });
      f.id = "after";
      Animate.forceToFinish();
      expect(attr(f, "id")).toBe("after");
    });
  });

  describe("x / y / width / height", () => {
    it("setters update attributes and write DOM after flush", () => {
      const f = new Filter();
      f.x = "5%";
      f.y = "5%";
      f.width = "200%";
      f.height = "200%";
      Animate.forceToFinish();
      expect(attr(f, "x")).toBe("5%");
      expect(attr(f, "y")).toBe("5%");
      expect(attr(f, "width")).toBe("200%");
      expect(attr(f, "height")).toBe("200%");
    });
  });
});

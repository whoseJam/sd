import { describe, expect, it } from "vitest";

import { Animate } from "@/animate/animate";
import { Blend } from "@/node/filter/blend";

const el = (n: Blend) => (n as any).renderer.element() as SVGElement;
const attr = (n: Blend, k: string) => el(n).getAttribute(k);

describe("Blend", () => {
  describe("mode", () => {
    it("setter updates attributes and fires listener", () => {
      const b = new Blend({ mode: "normal" });
      const seen: Array<[string, string]> = [];
      b.onModeChanged((vn, vo) => seen.push([vn, vo]));

      b.mode = "multiply";

      expect(b.attributes.mode).toBe("multiply");
      expect(b.mode).toBe("multiply");
      expect(b.getMode()).toBe("multiply");
      expect(seen).toEqual([["multiply", "normal"]]);
    });

    it("b.mode = v and b.setMode(v) reach the same model state", () => {
      const a = new Blend({ mode: "normal" });
      const b = new Blend({ mode: "normal" });
      a.mode = "screen";
      b.setMode("screen");
      expect(a.attributes.mode).toBe(b.attributes.mode);
    });

    it("setter writes DOM mode after animation flush", () => {
      const b = new Blend({ mode: "normal" });
      b.mode = "multiply";
      Animate.forceToFinish();
      expect(attr(b, "mode")).toBe("multiply");
    });
  });
});

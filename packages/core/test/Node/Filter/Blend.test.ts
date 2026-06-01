import { describe, expect, it } from "vitest";

import { Blend } from "@/Node/Filter/Blend";

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
  });
});

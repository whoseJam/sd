import { describe, expect, it } from "vitest";

import { ColorMatrix } from "@/Node/Filter/ColorMatrix";

describe("ColorMatrix", () => {
  describe("construction", () => {
    it("defaults to identity matrix when no values are passed", () => {
      const c = new ColorMatrix();
      expect(c.attributes.values).toEqual([
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
      ]);
      expect(c.attributes.type).toBe("matrix");
    });
  });

  describe("type", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new ColorMatrix({ type: "matrix" });
      const seen: Array<[string, string]> = [];
      c.onTypeChanged((vn, vo) => seen.push([vn, vo]));

      c.type = "saturate";

      expect(c.attributes.type).toBe("saturate");
      expect(seen).toEqual([["saturate", "matrix"]]);
    });
  });

  describe("values", () => {
    it("setter updates attributes and fires listener", () => {
      const c = new ColorMatrix({ type: "saturate", values: 1 });
      const seen: Array<[number | Array<number>, number | Array<number>]> = [];
      c.onValuesChanged((vn, vo) => seen.push([vn, vo]));

      c.values = 0.5;

      expect(c.attributes.values).toBe(0.5);
      expect(seen).toEqual([[0.5, 1]]);
    });

    it("c.values = v and c.setValues(v) reach the same model state", () => {
      const a = new ColorMatrix({ type: "saturate", values: 1 });
      const b = new ColorMatrix({ type: "saturate", values: 1 });
      a.values = 0.3;
      b.setValues(0.3);
      expect(a.attributes.values).toBe(b.attributes.values);
    });
  });
});

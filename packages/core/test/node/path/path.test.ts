import { beforeAll, describe, expect, it } from "vitest";

import type { SDNode } from "@/node/node";

import { Animate } from "@/animate/animate";
import { Root } from "@/interact/root";
import { Path } from "@/node/path/path";
import { PathEngine } from "@/node/path/path-engine";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Path needs Root.svg (PathEngine.init parents its bbox-measuring
// off-screen <path> under it) and PathEngine.init itself. Path parsing
// is fully in-house now (no Snap), so no external library to load.
beforeAll(() => {
  if (!Root.svg) Root.init();
  if (!(PathEngine as any).pathSVG) PathEngine.init();
});

describe("Path", () => {
  describe("construction", () => {
    it("stores d on attributes", () => {
      const p = new Path({ d: "M 0 0 L 10 20" });
      expect(p.attributes.d).toBe("M 0 0 L 10 20");
      expect(p.getD()).toBe("M 0 0 L 10 20");
    });

    it("flips y in d when painting the DOM", () => {
      const p = new Path({ d: "M 0 10 L 20 30" });
      // PathEngine.flipY rewrites absolute y-coords to negative.
      expect(attr(p, "d")).toBe("M0,-10L20,-30");
    });
  });

  describe("d", () => {
    it("setter updates attributes and fires listener", () => {
      const p = new Path({ d: "M 0 0 L 10 0" });
      const seen: Array<[string, string]> = [];
      p.onAttributeChanged("d", (vn: string, vo: string) =>
        seen.push([vn, vo]),
      );

      const next = "M 0 0 L 30 40";
      p.d = next;

      expect(p.attributes.d).toBe(next);
      expect(p.d).toBe(next);
      expect(p.getD()).toBe(next);
      expect(seen).toEqual([[next, "M 0 0 L 10 0"]]);
    });

    it("p.d = v and p.setD(v) reach the same model state", () => {
      const a = new Path({ d: "M 0 0 L 1 1" });
      const b = new Path({ d: "M 0 0 L 1 1" });
      const next = "M 2 2 L 3 3";
      a.d = next;
      b.setD(next);
      expect(a.attributes.d).toBe(b.attributes.d);
    });

    it("setter writes flipped d to DOM after animation flush", () => {
      const p = new Path({ d: "M 0 0 L 0 0" });
      p.d = "M 0 10 L 20 30";
      Animate.forceToFinish();
      expect(attr(p, "d")).toBe("M0,-10L20,-30");
    });
  });
});

import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Animate } from "@/Animate/Animate";
import { Root } from "@/Interact/Root";
import { Path } from "@/Node/Path/Path";
import { PathEngine } from "@/Node/Path/PathEngine";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Path needs three things at runtime that the default test env doesn't
// provide:
//   1. Snap as a global (PathEngine.flipY / toBox call Snap.parsePathString)
//   2. Root.svg (PathEngine.init parents its pathSVG under it)
//   3. PathEngine.init (creates the off-screen <path> used for bbox)
beforeAll(() => {
  if (!(globalThis as any).Snap) {
    const snapPath = path.resolve(__dirname, "../../../../assets/snap.svg.js");
    new Function(fs.readFileSync(snapPath, "utf8")).call(globalThis);
  }
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
      expect(attr(p, "d")).toBe("M 0 -10L 20 -30");
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
      expect(attr(p, "d")).toBe("M 0 -10L 20 -30");
    });
  });
});

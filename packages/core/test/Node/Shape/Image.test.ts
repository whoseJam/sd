import { describe, expect, it } from "vitest";

import type { SDNode } from "@/Node/SDNode";

import { Animate } from "@/Animate/Animate";
import { Image } from "@/Node/Shape/Image";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);
describe("Image", () => {
  describe("construction", () => {
    it("flips top-left y the same way Rect does", () => {
      const i = new Image({ x: 10, y: 20, width: 30, height: 40, src: "" });
      expect(attr(i, "x")).toBe("10");
      expect(attr(i, "y")).toBe(String(-(20 + 40)));
    });
  });

  describe("x", () => {
    it("setter updates attributes and fires listener", () => {
      const i = new Image({ x: 0 });
      const seen: Array<[number, number]> = [];
      i.onXChanged((vn, vo) => seen.push([vn, vo]));

      i.x = 17;

      expect(i.attributes.x).toBe(17);
      expect(i.getX()).toBe(17);
      expect(seen).toEqual([[17, 0]]);
    });

    it("i.x = v and i.setX(v) reach the same model state", () => {
      const a = new Image({ x: 5 });
      const b = new Image({ x: 5 });
      a.x = 9;
      b.setX(9);
      expect(a.attributes.x).toBe(b.attributes.x);
    });
  });

  describe("y", () => {
    it("setter updates attributes and fires listener with math value", () => {
      const i = new Image({ y: 0, height: 40 });
      const seen: Array<[number, number]> = [];
      i.onYChanged((vn, vo) => seen.push([vn, vo]));

      i.y = 25;

      expect(i.attributes.y).toBe(25);
      expect(seen).toEqual([[25, 0]]);
    });

    it("setter flips DOM y to -(y + height) after animation flush", () => {
      const i = new Image({ y: 0, height: 40 });
      i.y = 25;
      Animate.forceToFinish();
      expect(attr(i, "y")).toBe(String(-(25 + 40)));
    });
  });

  describe("width", () => {
    it("setter updates attributes and fires listener", () => {
      const i = new Image({ width: 40 });
      const seen: Array<[number, number]> = [];
      i.onWidthChanged((vn, vo) => seen.push([vn, vo]));

      i.width = 60;

      expect(i.attributes.width).toBe(60);
      expect(seen).toEqual([[60, 40]]);
    });
  });

  describe("height", () => {
    // Tier 4: height change re-fires y, same contract as Rect.
    it("setter fires height listener and re-fires y with unchanged math value", () => {
      const i = new Image({ y: 10, height: 40 });
      const heightSeen: Array<[number, number]> = [];
      const ySeen: Array<[number, number]> = [];
      i.onHeightChanged((vn, vo) => heightSeen.push([vn, vo]));
      i.onYChanged((vn, vo) => ySeen.push([vn, vo]));

      i.height = 70;

      expect(i.attributes.height).toBe(70);
      expect(heightSeen).toEqual([[70, 40]]);
      expect(ySeen).toEqual([[10, 10]]);
    });

    it("DOM y recomputes with new height after flush", () => {
      const i = new Image({ y: 10, height: 40 });
      i.height = 70;
      Animate.forceToFinish();
      expect(attr(i, "height")).toBe("70");
      expect(attr(i, "y")).toBe(String(-(10 + 70)));
    });
  });

  describe("src", () => {
    it("setter updates attributes and fires listener", () => {
      const i = new Image({ src: "" });
      const seen: Array<[string, string]> = [];
      i.onSrcChanged((vn, vo) => seen.push([vn, vo]));

      i.src = "/foo.png";

      expect(i.attributes.src).toBe("/foo.png");
      expect(seen).toEqual([["/foo.png", ""]]);
    });
  });
});

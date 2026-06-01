import { beforeEach, describe, expect, it } from "vitest";
import { Circle } from "@/Node/Shape/Circle";
import type { SDNode } from "@/Node/SDNode";
import { Animate } from "@/Animate/Animate";
import { ActionList } from "@/Animate/ActionList";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Setter writes go through triggerAttributeChanged which queues an Action
// onto the Animate timeline. setup.ts stubs rAF to a noop, so nothing ever
// ticks on its own — we flush the queue with Animate.forceToFinish() and
// then assert the resulting visual state. This exercises the full pipeline
// (Action + Interp endpoint logic + renderAttribute) instead of bypassing
// it via Window.SHOULD_INTERP = false.
describe("Circle", () => {
  beforeEach(() => {
    Animate.currentActionList = new ActionList();
  });

  describe("construction", () => {
    it("flips cy on the DOM but keeps math cy on the model", () => {
      const c = new Circle({ cx: 100, cy: 50, r: 10 });
      expect(attr(c, "cx")).toBe("100");
      expect(attr(c, "cy")).toBe("-50");
      expect(c.getCy()).toBe(50);
    });
  });

  describe("cx", () => {
    it("setter writes attributes and listener immediately, DOM after flush", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCxChanged((vn, vo) => seen.push([vn, vo]));

      c.cx = 42;

      // model + listener fire synchronously inside triggerAttributeChanged
      expect(c.attributes.cx).toBe(42);
      expect(c.cx).toBe(42);
      expect(c.getCx()).toBe(42);
      expect(seen).toEqual([[42, 0]]);
      // DOM only catches up after the timeline ticks
      expect(attr(c, "cx")).toBe("0");

      Animate.forceToFinish();
      expect(attr(c, "cx")).toBe("42");
    });

    it("c.cx = v and c.setCx(v) produce identical DOM after flush", () => {
      const a = new Circle({ cx: 5 });
      const b = new Circle({ cx: 5 });
      a.cx = 7;
      b.setCx(7);
      Animate.forceToFinish();
      expect(el(a).outerHTML).toBe(el(b).outerHTML);
    });
  });

  describe("cy", () => {
    it("setter writes flipped DOM cy after flush, fires listener with math value", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCyChanged((vn, vo) => seen.push([vn, vo]));

      c.cy = 30;

      expect(c.attributes.cy).toBe(30);
      expect(seen).toEqual([[30, 0]]);

      Animate.forceToFinish();
      expect(attr(c, "cy")).toBe("-30");
    });
  });

  describe("r", () => {
    it("setter writes attributes and DOM (after flush), fires listener", () => {
      const c = new Circle({ r: 10 });
      const seen: Array<[number, number]> = [];
      c.onRChanged((vn, vo) => seen.push([vn, vo]));

      c.r = 25;

      expect(c.attributes.r).toBe(25);
      expect(seen).toEqual([[25, 10]]);

      Animate.forceToFinish();
      expect(attr(c, "r")).toBe("25");
    });
  });
});

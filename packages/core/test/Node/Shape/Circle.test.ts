import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Circle } from "@/Node/Shape/Circle";
import type { SDNode } from "@/Node/SDNode";
import { Window } from "@/Animate/Window";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Setter writes go through triggerAttributeChanged, which queues an Action
// when Window.SHOULD_INTERP is true (the default). Going through the
// timeline + forceToFinish() here would be more faithful to production,
// but createSVGNode still does `Object.assign(this, attributes)` at
// construction, which fires the accessor setters before this.renderer is
// assigned and pushes broken Actions onto the queue — flush then crashes.
// Until createSVGNode is reworked to stop conflating model init with DOM
// paint, tests run with SHOULD_INTERP off so setters write the DOM
// synchronously and we can assert the steady-state contract.
describe("Circle", () => {
  beforeEach(() => {
    Window.SHOULD_INTERP = false;
  });
  afterEach(() => {
    Window.SHOULD_INTERP = true;
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
    it("setter writes attributes, DOM, and fires listener", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCxChanged((vn, vo) => seen.push([vn, vo]));

      c.cx = 42;

      expect(c.attributes.cx).toBe(42);
      expect(c.cx).toBe(42);
      expect(c.getCx()).toBe(42);
      expect(attr(c, "cx")).toBe("42");
      expect(seen).toEqual([[42, 0]]);
    });

    it("c.cx = v and c.setCx(v) produce identical DOM", () => {
      const a = new Circle({ cx: 5 });
      const b = new Circle({ cx: 5 });
      a.cx = 7;
      b.setCx(7);
      expect(el(a).outerHTML).toBe(el(b).outerHTML);
    });
  });

  describe("cy", () => {
    it("setter writes flipped DOM cy and fires listener with math value", () => {
      const c = new Circle({ cx: 0, cy: 0, r: 10 });
      const seen: Array<[number, number]> = [];
      c.onCyChanged((vn, vo) => seen.push([vn, vo]));

      c.cy = 30;

      expect(c.attributes.cy).toBe(30);
      expect(attr(c, "cy")).toBe("-30");
      expect(seen).toEqual([[30, 0]]);
    });
  });

  describe("r", () => {
    it("setter writes attributes, DOM, and fires listener", () => {
      const c = new Circle({ r: 10 });
      const seen: Array<[number, number]> = [];
      c.onRChanged((vn, vo) => seen.push([vn, vo]));

      c.r = 25;

      expect(c.attributes.r).toBe(25);
      expect(attr(c, "r")).toBe("25");
      expect(seen).toEqual([[25, 10]]);
    });
  });
});

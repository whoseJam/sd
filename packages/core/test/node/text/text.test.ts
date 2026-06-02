import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SDNode } from "@/node/node";

import { Animate } from "@/animate/animate";
import { Group } from "@/node/other/group";
import { Text } from "@/node/text/text";
import { FontManager } from "@/node/text/text-engine/opentype";

const el = (n: SDNode) => (n as any).renderer.element() as SVGElement;
const attr = (n: SDNode, k: string) => el(n).getAttribute(k);

// Deterministic stand-in for real font metrics: 10px wide per char, 20px tall.
// Lets us assert exact widths/heights without depending on happy-dom's getBBox
// (which returns 0×0) or on real .ttf fonts (which aren't loaded in tests).
let bboxSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  bboxSpy = vi
    .spyOn(FontManager, "boundingBox")
    .mockImplementation((text: any) => {
      const text_ = typeof text === "string" ? text : text.getText();
      return { width: text_.length * 10, height: 20 } as any;
    });
});

describe("Text", () => {
  describe("construction", () => {
    it("empty text yields zero-width box and empty styles/html", () => {
      const t = new Text();
      expect(t.attributes.text).toBe("");
      expect(t.attributes.subtextStyles).toEqual([]);
      expect(t.attributes.html).toBe("");
      expect(t.getLocalBox()).toMatchObject({ width: 0, height: 20 });
    });

    it("non-empty text measures via FontManager and populates html/styles", () => {
      const t = new Text({ text: "abc" });
      expect(t.attributes.text).toBe("abc");
      // All-default PathStyle on every char → parseToHTML emits plain text,
      // no <tspan>.
      expect(t.attributes.html).toBe("abc");
      expect(t.attributes.subtextStyles).toHaveLength(3);
      expect(t.getLocalBox()).toMatchObject({ width: 30, height: 20 });
    });

    // parseToHTML has two paths: an all-default fast path that copies text
    // verbatim, and a styled path that escapes via parseText. Construction
    // hits the fast path, so < and > are NOT escaped. This is asymmetric
    // with the styled path (covered in "subtext styling" below) and is
    // worth flagging — see notes in setSubtext* tests.
    it("default-style fast path copies text verbatim (no escape)", () => {
      const t = new Text({ text: "a <b> c" });
      expect(t.attributes.html).toBe("a <b> c");
    });

    it("defaults: fontSize=20, fontFamily='Times New Roman'", () => {
      const t = new Text();
      expect(t.attributes.fontSize).toBe(20);
      expect(t.attributes.fontFamily).toBe("Times New Roman");
    });

    it("writes text-anchor=start and dominant-baseline=text-before-edge", () => {
      const t = new Text({ text: "x" });
      expect(attr(t, "text-anchor")).toBe("start");
      expect(attr(t, "dominant-baseline")).toBe("text-before-edge");
    });

    it("flips DOM y to -(y + height) immediately via refreshY", () => {
      const t = new Text({ text: "abc", y: 25 });
      expect(attr(t, "y")).toBe(String(-(25 + 20)));
    });

    it("targetNode appends the Text and sets parent", () => {
      const g = new Group();
      const t = new Text({ text: "x", targetNode: g });
      expect(t.parent).toBe(g);
    });
  });

  describe("x / y (from BaseText)", () => {
    it("x setter updates attribute and fires listener", () => {
      const t = new Text({ text: "abc", x: 0 });
      const seen: Array<[number, number]> = [];
      t.onXChanged((vn, vo) => seen.push([vn, vo]));

      t.x = 17;

      expect(t.attributes.x).toBe(17);
      expect(t.getLocalX()).toBe(17);
      expect(seen).toEqual([[17, 0]]);
    });

    it("t.x = v and t.setX(v) reach the same model state", () => {
      const a = new Text({ text: "abc", x: 5 });
      const b = new Text({ text: "abc", x: 5 });
      a.x = 9;
      b.setX(9);
      expect(a.attributes.x).toBe(b.attributes.x);
    });

    it("y setter fires listener with the math value (not the flipped DOM value)", () => {
      const t = new Text({ text: "abc", y: 0 });
      const seen: Array<[number, number]> = [];
      t.onYChanged((vn, vo) => seen.push([vn, vo]));

      t.y = 25;

      expect(t.attributes.y).toBe(25);
      expect(seen).toEqual([[25, 0]]);
    });

    it("DOM y flips to -(y + height) after Animate.forceToFinish()", () => {
      const t = new Text({ text: "abc", y: 0 });
      t.y = 25;
      Animate.forceToFinish();
      expect(attr(t, "y")).toBe(String(-(25 + 20)));
    });
  });

  describe("fontSize", () => {
    it("setter writes attribute and fires listener", () => {
      const t = new Text({ text: "abc", fontSize: 20 });
      const seen: Array<[number, number]> = [];
      t.onFontSizeChanged((vn, vo) => seen.push([vn, vo]));

      t.fontSize = 40;

      expect(t.attributes.fontSize).toBe(40);
      expect(seen).toEqual([[40, 20]]);
    });

    it("fontSize = v and setFontSize(v) reach the same state", () => {
      const a = new Text({ text: "abc", fontSize: 20 });
      const b = new Text({ text: "abc", fontSize: 20 });
      a.fontSize = 40;
      b.setFontSize(40);
      expect(a.attributes.fontSize).toBe(b.attributes.fontSize);
    });

    it("scales cached width/height proportionally on the > 1e-1 branch", () => {
      const t = new Text({ text: "abc", fontSize: 20 });
      t.setFontSize(40);
      expect(t.getLocalBox()).toMatchObject({ width: 60, height: 40 });
    });

    it("recomputes via FontManager on the ~0 branch", () => {
      const t = new Text({ text: "abc", fontSize: 0 });
      bboxSpy.mockClear();
      t.setFontSize(20);
      expect(bboxSpy).toHaveBeenCalled();
    });

    it("refreshes DOM y after height changes", () => {
      const t = new Text({ text: "abc", y: 10, fontSize: 20 });
      expect(attr(t, "y")).toBe(String(-(10 + 20)));
      t.setFontSize(40);
      Animate.forceToFinish();
      expect(attr(t, "y")).toBe(String(-(10 + 40)));
    });
  });

  describe("setText", () => {
    it("no-op when text equals current value", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      const seen: Array<string> = [];
      t.onTextChanged((vn) => seen.push(vn));
      t.setText("abc");
      expect(seen).toEqual([]);
    });

    it("numeric input is coerced via String()", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      t.setText(42);
      expect(t.attributes.text).toBe("42");
    });

    it("fires text + html listeners and resizes subtextStyles to match new text", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      const textSeen: Array<string> = [];
      const htmlSeen: Array<string> = [];
      t.onTextChanged((vn) => textSeen.push(vn));
      t.onAttributeChanged("html", (vn: string) => htmlSeen.push(vn));

      t.setText("wxyz");

      expect(textSeen).toEqual(["wxyz"]);
      expect(htmlSeen).toEqual(["wxyz"]);
      expect(t.attributes.subtextStyles).toHaveLength(4);
    });

    it("recomputes width/height and refreshes DOM y", () => {
      const t = new Text({ text: "abc", y: 5, targetNode: new Group() });
      expect(attr(t, "y")).toBe(String(-(5 + 20)));
      t.setText("abcdef");
      Animate.forceToFinish();
      expect(t.getLocalBox()).toMatchObject({ width: 60, height: 20 });
      expect(attr(t, "y")).toBe(String(-(5 + 20)));
    });

    it("emits plain text (no <tspan>) when all new styles are default", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      t.setText("xyz");
      expect(t.attributes.html).toBe("xyz");
    });
  });

  describe("fontFamily", () => {
    it("rejects unsupported families", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      expect(() => t.setFontFamily("Comic Sans")).toThrow(/not supported/);
    });

    it("accepts Arial and fires fontFamily listener", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      const seen: Array<[string, string]> = [];
      t.onFontFamilyChanged((vn, vo) => seen.push([vn, vo]));
      t.setFontFamily("Arial");
      expect(t.attributes.fontFamily).toBe("Arial");
      expect(seen).toEqual([["Arial", "Times New Roman"]]);
    });
  });

  describe("subtext styling", () => {
    it("setSubtextFill updates only the matched range's fill", () => {
      const t = new Text({ text: "abcde", targetNode: new Group() });
      t.setSubtextFill("cd", "#ff0000");
      const s = t.attributes.subtextStyles;
      expect(s[0].fill).toBe("default");
      expect(s[1].fill).toBe("default");
      expect(s[2].fill).toBe("#ff0000");
      expect(s[3].fill).toBe("#ff0000");
      expect(s[4].fill).toBe("default");
    });

    it("setSubtextStroke and setSubtextStrokeWidth target their respective fields", () => {
      const t = new Text({ text: "abcde", targetNode: new Group() });
      t.setSubtextStroke("bc", "#00ff00");
      t.setSubtextStrokeWidth("de", 3);
      const s = t.attributes.subtextStyles;
      expect(s[1].stroke).toBe("#00ff00");
      expect(s[2].stroke).toBe("#00ff00");
      expect(s[3].strokeWidth).toBe(3);
      expect(s[4].strokeWidth).toBe(3);
    });

    it("DOM innerHTML reflects the new tspan after Animate.forceToFinish()", () => {
      const t = new Text({ text: "abcde", targetNode: new Group() });
      t.setSubtextFill("cd", "#ff0000");
      Animate.forceToFinish();
      const innerHTML = el(t).innerHTML;
      // Locks in the trigger path — bare attribute mutation would leave
      // innerHTML at the construction-time value ("abcde") and color would
      // never appear on screen.
      expect(innerHTML.toLowerCase()).toContain("tspan");
      expect(innerHTML).toMatch(/fill\s*=\s*['"]#ff0000['"]/i);
      expect(innerHTML).toContain("cd");
    });

    // The styled (tspan) path goes through parseText, which DOES escape <>.
    // Asymmetry vs. the all-default fast path is intentional to flag here.
    it("styled path escapes < and > via parseText", () => {
      const t = new Text({ text: "a<b>", targetNode: new Group() });
      t.setSubtextFill("<", "#ff0000");
      expect(t.attributes.html).toContain("&lt;");
      expect(t.attributes.html).toContain("&gt;");
    });

    it("matchSubtext throws when pattern is absent", () => {
      const t = new Text({ text: "abcde", targetNode: new Group() });
      expect(() => t.setSubtextFill("zz", "#000000")).toThrow(
        /Subtext Not Found/,
      );
    });

    it("i selects the i-th (zero-indexed) occurrence", () => {
      const t = new Text({ text: "ababab", targetNode: new Group() });
      t.setSubtextFill("ab", "#ff0000", 1);
      const s = t.attributes.subtextStyles;
      expect(s[0].fill).toBe("default");
      expect(s[1].fill).toBe("default");
      expect(s[2].fill).toBe("#ff0000");
      expect(s[3].fill).toBe("#ff0000");
      expect(s[4].fill).toBe("default");
      expect(s[5].fill).toBe("default");
    });

    it("throws when i exceeds the number of matches", () => {
      const t = new Text({ text: "abab", targetNode: new Group() });
      expect(() => t.setSubtextFill("ab", "#000000", 2)).toThrow(
        /Subtext Not Found/,
      );
    });
  });

  describe("getLocalBox", () => {
    it("returns x/y/width/height reflecting current state", () => {
      const t = new Text({ text: "abc", x: 4, y: 6 });
      expect(t.getLocalBox()).toEqual({ x: 4, y: 6, width: 30, height: 20 });
    });
  });

  describe("listener add/remove", () => {
    it("offTextChanged stops further notifications", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      const seen: Array<string> = [];
      const handler = (vn: string) => seen.push(vn);
      t.onTextChanged(handler);
      t.setText("xyz");
      t.offTextChanged(handler);
      t.setText("zzz");
      expect(seen).toEqual(["xyz"]);
    });

    it("offFontSizeChanged stops further notifications", () => {
      const t = new Text({ text: "abc" });
      const seen: Array<number> = [];
      const handler = (vn: number) => seen.push(vn);
      t.onFontSizeChanged(handler);
      t.setFontSize(40);
      t.offFontSizeChanged(handler);
      t.setFontSize(50);
      expect(seen).toEqual([40]);
    });

    it("offFontFamilyChanged stops further notifications", () => {
      const t = new Text({ text: "abc", targetNode: new Group() });
      const seen: Array<string> = [];
      const handler = (vn: string) => seen.push(vn);
      t.onFontFamilyChanged(handler);
      t.setFontFamily("Arial");
      t.offFontFamilyChanged(handler);
      t.setFontFamily("Times New Roman");
      expect(seen).toEqual(["Arial"]);
    });
  });
});

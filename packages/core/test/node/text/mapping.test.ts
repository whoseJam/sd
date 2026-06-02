import { describe, expect, it } from "vitest";

import { match, matchSubtext } from "@/node/text/text-engine/mapping";
import { createTextView } from "@/node/text/text-engine/text-view";

// Three bugs lived in mapping.ts simultaneously:
//   (1) `match()` used `array.push(a, b)` instead of `push([a, b])`, so
//       intermediate items were scalar SubtextViews and downstream
//       `mapping.map(m => m[0])` produced undefined → `.count()` throws.
//   (2) `calculate()` read `deleted[j]` (indexed by pattern position)
//       instead of `deleted[i + j]` (textView position).
//   (3) `calculate()` never wrote into `deleted` after a successful
//       match, so repeated patterns hit the same position and the
//       trailing unmapped-union pass included already-matched chars.
// Each test below would fail under exactly one (or more) of those bugs.

describe("match", () => {
  it("returns an array of [source, target] SubtextView tuples (locks bug #1)", () => {
    const sourceView = createTextView("ab", {});
    const targetView = createTextView("ab", {});
    const matchings = match(sourceView, targetView, [
      { source: "a", target: "a" },
    ]);
    // one explicit pair + the trailing unmapped-union pair → length 2
    expect(matchings).toHaveLength(2);
    for (const item of matchings) {
      expect(Array.isArray(item)).toBe(true);
      expect(item).toHaveLength(2);
      expect(typeof item[0].count).toBe("function");
      expect(typeof item[1].count).toBe("function");
    }
  });

  it("excludes explicitly-mapped chars from the trailing unmapped union (locks bug #3)", () => {
    const sourceView = createTextView("abc", {});
    const targetView = createTextView("abc", {});
    const matchings = match(sourceView, targetView, [
      { source: "ab", target: "ab" },
    ]);
    expect(matchings).toHaveLength(2);
    const unmapped = matchings[1];
    // only "c" is left on each side
    expect(unmapped[0].count()).toBe(1);
    expect(unmapped[1].count()).toBe(1);
  });

  it("a repeated pattern advances past the first occurrence (locks bugs #2 + #3 together)", () => {
    const sourceView = createTextView("abab", {});
    const targetView = createTextView("xxxx", {});
    const matchings = match(sourceView, targetView, [
      { source: "ab", target: "xx" },
      { source: "ab", target: "xx" },
    ]);
    expect(matchings).toHaveLength(3);
    // Both "ab" mappings consume 2 source chars each → 4 of 4 covered →
    // unmapped union is empty on both sides. Under either bug the second
    // "ab" would re-hit positions 0-1 instead of 2-3.
    const unmapped = matchings[2];
    expect(unmapped[0].count()).toBe(0);
    expect(unmapped[1].count()).toBe(0);
  });
});

describe("matchSubtext", () => {
  // matchSubtext is the simpler sibling of `calculate` used by
  // Text.setSubtext*. The occurrence-index parameter was a dead arg
  // until a recent fix; lock that contract here as well so the
  // setSubtext* tests don't have to know matchSubtext internals.
  it("returns the i-th occurrence", () => {
    const view = createTextView("ababab", {});
    const sub0 = matchSubtext(view, "ab", 0);
    const sub1 = matchSubtext(view, "ab", 1);
    const sub2 = matchSubtext(view, "ab", 2);
    expect(sub0.l).toBe(0);
    expect(sub1.l).toBe(2);
    expect(sub2.l).toBe(4);
  });

  it("throws when i exceeds the available matches", () => {
    const view = createTextView("abab", {});
    expect(() => matchSubtext(view, "ab", 2)).toThrow(/Subtext Not Found/);
  });
});

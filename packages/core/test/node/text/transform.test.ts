import { beforeEach, describe, expect, it, vi } from "vitest";

// Module mocks isolate transformPostProcess from the real animate scheduler
// and the real DOM. We capture pushed actions and created path nodes, then
// assert the contract: every <path> the morph emits must end up with a
// `fill` set (either via attribute or via a fill action) — otherwise the
// fading char renders with the SVG default (black), regardless of the
// owning Text's fill.

const pushedActions: Array<{ key: string; entity: object; from: unknown; to: unknown }> = [];
const createdPaths: Array<{ attrs: Map<string, unknown> }> = [];

vi.mock("@/animate/animate", async () => {
  const actual = await vi.importActual<typeof import("@/animate/animate")>(
    "@/animate/animate",
  );
  return {
    ...actual,
    pushAction: (opts: { key: string; entity: object; from: unknown; to: unknown }) =>
      pushedActions.push(opts),
    Animate: {
      ...actual.Animate,
      getAttribute: vi.fn(),
    },
  };
});

vi.mock("@/node/text/text-engine/path", () => ({
  getPaths: vi.fn(),
}));

vi.mock("@/renderer/render-node", () => ({
  RenderNode: {
    createRenderNodeWithTime: () => ({
      __animate: () => ({ remove: () => {} }),
    }),
    createRenderNodeWithoutAction: () => {
      const node = {
        attrs: new Map<string, unknown>(),
        setAttribute(k: string, v: unknown) {
          node.attrs.set(k, v);
        },
      };
      createdPaths.push(node);
      return node;
    },
  },
}));

import { Animate } from "@/animate/animate";
import { getPaths } from "@/node/text/text-engine/path";
import { transformPostProcess } from "@/node/text/text-engine/transform";

function subtext(positions: number[]) {
  return { iterate: (cb: (p: number) => void) => positions.forEach(cb) };
}

function pathView(d: string) {
  return { d, transform: { toString: () => "matrix(1,0,0,1,0,0)" } };
}

function styleEntry(fill: string, stroke: string) {
  return {
    styleAt: () => ({ fill, stroke, strokeWidth: 1, strokeDashArray: [] }),
  };
}

function invokeMorph(
  l: number,
  r: number,
  sourceSubs: ReturnType<typeof subtext>[],
  targetSubs: ReturnType<typeof subtext>[],
) {
  const fn = transformPostProcess({} as never, {} as never);
  fn.call({ timingFunction: () => 0 } as never, l, r, sourceSubs as never, targetSubs as never);
}

function fillOn(node: { attrs: Map<string, unknown> } | undefined): unknown {
  if (!node) return undefined;
  if (node.attrs.has("fill")) return node.attrs.get("fill");
  const action = pushedActions.find((a) => a.entity === node && a.key === "fill");
  return action?.to ?? action?.from;
}

beforeEach(() => {
  pushedActions.length = 0;
  createdPaths.length = 0;
  vi.mocked(getPaths).mockReset();
  vi.mocked(Animate.getAttribute).mockReset();
});

describe("transformPostProcess", () => {
  it("matched chars carry the text's fill via fill action", () => {
    vi.mocked(getPaths)
      .mockReturnValueOnce([pathView("M0,0L10,0")] as never)
      .mockReturnValueOnce([pathView("M0,0L10,5")] as never);
    vi.mocked(Animate.getAttribute).mockReturnValue([styleEntry("#ff0000", "none")]);

    invokeMorph(0, 1, [subtext([0])], [subtext([0])]);

    expect(createdPaths).toHaveLength(1);
    expect(fillOn(createdPaths[0])).toBe("#ff0000");
  });

  it("fade-in (sourceIndex undefined) carries target's fill, not SVG default", () => {
    // "" → "X": sourcePositions empty, targetPositions=[0]. alignCharacterSequence
    // returns [[undefined, 0]] → fadePath branch (line 95-98 in transform.ts).
    vi.mocked(getPaths)
      .mockReturnValueOnce([] as never)
      .mockReturnValueOnce([pathView("M0,0L10,0")] as never);
    vi.mocked(Animate.getAttribute)
      .mockReturnValueOnce([]) // source styles
      .mockReturnValueOnce([styleEntry("#ff0000", "none")]); // target styles

    invokeMorph(0, 1, [subtext([])], [subtext([0])]);

    expect(createdPaths).toHaveLength(1);
    expect(fillOn(createdPaths[0])).toBe("#ff0000");
  });

  it("fade-out (targetIndex undefined) carries source's fill, not SVG default", () => {
    // "X" → "": sourcePositions=[0], targetPositions empty. alignCharacterSequence
    // returns [[0, undefined]] → fadePath branch (line 99-102).
    vi.mocked(getPaths)
      .mockReturnValueOnce([pathView("M0,0L10,0")] as never)
      .mockReturnValueOnce([] as never);
    vi.mocked(Animate.getAttribute)
      .mockReturnValueOnce([styleEntry("#00ff00", "none")])
      .mockReturnValueOnce([]);

    invokeMorph(0, 1, [subtext([0])], [subtext([])]);

    expect(createdPaths).toHaveLength(1);
    expect(fillOn(createdPaths[0])).toBe("#00ff00");
  });

  it("source-path undefined (whitespace glyph) → fade-in path carries target fill", () => {
    // Both indices map (matched alignment), but getPaths returned undefined
    // for source — that's the "whitespace glyph" case (getTextPaths returns
    // undefined for empty path data). Branch at line 104-107.
    vi.mocked(getPaths)
      .mockReturnValueOnce([undefined] as never)
      .mockReturnValueOnce([pathView("M0,0L10,0")] as never);
    vi.mocked(Animate.getAttribute).mockReturnValue([styleEntry("#0000ff", "none")]);

    invokeMorph(0, 1, [subtext([0])], [subtext([0])]);

    expect(createdPaths).toHaveLength(1);
    expect(fillOn(createdPaths[0])).toBe("#0000ff");
  });

  it("target-path undefined (whitespace glyph) → fade-out path carries source fill", () => {
    // Mirror of the above; branch at line 108-111.
    vi.mocked(getPaths)
      .mockReturnValueOnce([pathView("M0,0L10,0")] as never)
      .mockReturnValueOnce([undefined] as never);
    vi.mocked(Animate.getAttribute).mockReturnValue([styleEntry("#abcdef", "none")]);

    invokeMorph(0, 1, [subtext([0])], [subtext([0])]);

    expect(createdPaths).toHaveLength(1);
    expect(fillOn(createdPaths[0])).toBe("#abcdef");
  });
});

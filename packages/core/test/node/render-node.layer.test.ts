import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SDNode } from "@/node/node";

import { Animate } from "@/animate/animate";
import { Window } from "@/animate/window";
import { Status } from "@/interact/status";
import { Group } from "@/node/other/group";
import { Rect } from "@/node/shape/rect";

// DOM helpers
const domChildren = (node: SDNode): Element[] =>
  Array.from((node as any).renderer.element().children);

const indexOf = (group: Group, child: Rect): number =>
  domChildren(group).indexOf((child as any).renderer.element());

// Timeline helpers
const flush = () => Animate.forceToFinish();
const rollback = () => {
  Animate.rollbackFrame();
  flush();
};

function makeGroup(count: number) {
  const g = new Group();
  const rects = Array.from(
    { length: count },
    () => new Rect({ targetNode: g }),
  );
  // Group.appendChild defers DOM inserts via lifecycle actions. Flush them now
  // so children are in DOM before the test starts, then wipe the action list so
  // these setup actions don't pollute the beat under test.
  Animate.forceToFinish();
  Animate.startNewFrame();
  Window.CURRENT_FRAME = 0;
  Window.MAXIMUM_FRAME = 0;
  (Animate as any).historyActionList = {};
  return { g, rects };
}

beforeEach(() => {
  vi.spyOn(Status, "updateFrameStatus").mockImplementation(() => {});
  Window.ACTION_DELAY = 0;
  Window.CURRENT_FRAME = 0;
  Window.MAXIMUM_FRAME = 0;
  (Animate as any).historyActionList = {};
  // startNewFrame() internally creates a fresh ActionList; reset counters after.
  Animate.startNewFrame();
  Window.CURRENT_FRAME = 0;
  Window.MAXIMUM_FRAME = 0;
});

// ─── raise ───────────────────────────────────────────────────────────────────

describe("raise", () => {
  it("forward: moves element to last position", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    a.raise();
    flush();

    expect(indexOf(g, a)).toBe(2);
    expect(indexOf(g, b)).toBe(0);
    expect(indexOf(g, c)).toBe(1);
  });

  it("rollback: restores element to its original position", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    a.raise();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });

  it("rollback: raising the already-last element is safe", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    c.raise();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });

  it("rollback: two raises in the same beat both restore correctly", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);
    // [a,b,c] → raise(a) → [b,c,a] → raise(b) → [c,a,b]

    a.raise();
    b.raise();
    flush();
    expect(indexOf(g, c)).toBe(0);
    expect(indexOf(g, a)).toBe(1);
    expect(indexOf(g, b)).toBe(2);

    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });
});

// ─── lower ───────────────────────────────────────────────────────────────────

describe("lower", () => {
  it("forward: moves element to first position", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    c.lower();
    flush();

    expect(indexOf(g, c)).toBe(0);
    expect(indexOf(g, a)).toBe(1);
    expect(indexOf(g, b)).toBe(2);
  });

  it("rollback: restores element to its original position", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    c.lower();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });

  it("rollback: lowering the already-first element is safe", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    a.lower();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe("remove", () => {
  it("forward: detaches element from DOM", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    b.startAnimate({ duration: 100 }).remove().endAnimate();
    flush();

    expect(indexOf(g, b)).toBe(-1);
    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, c)).toBe(1);
  });

  it("rollback: restores middle element to its exact slot", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    b.startAnimate({ duration: 100 }).remove().endAnimate();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1); // must be slot 1, not 2 (appended at end)
    expect(indexOf(g, c)).toBe(2);
  });

  it("rollback: restores first element to slot 0", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    a.startAnimate({ duration: 100 }).remove().endAnimate();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });

  it("rollback: restores last element to last slot", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);

    c.startAnimate({ duration: 100 }).remove().endAnimate();
    flush();
    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });
});

// ─── raise + lower in the same beat ─────────────────────────────────────────

describe("raise and lower combined", () => {
  it("rollback restores original order after raise(a) then lower(c)", () => {
    const {
      g,
      rects: [a, b, c],
    } = makeGroup(3);
    // [a,b,c] → raise(a) → [b,c,a] → lower(c) → [c,b,a]

    a.raise();
    c.lower();
    flush();

    rollback();

    expect(indexOf(g, a)).toBe(0);
    expect(indexOf(g, b)).toBe(1);
    expect(indexOf(g, c)).toBe(2);
  });
});

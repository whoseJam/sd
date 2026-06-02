import { describe, expect, it, vi } from "vitest";

import { Action } from "@/animate/action";
import {
  Interp,
  InterpObject,
  isInterpCreator,
  isLazyInterpFunction,
  lazyInterp,
} from "@/animate/interp";

const mockTarget = () => ({ setAttribute: vi.fn() });

// InterpObject's onInit/onBeforeInterp/onAfterInterp dispatch via
// `call instanceof Action` to distinguish "register a handler" from "fire it",
// so we need a real prototype chain — Object.create(Action.prototype) is the
// minimal way to get past instanceof without going through `new Action(...)`
// (which would also build an InterpObject and capture Window state).
const defaultEntity = {
  renderAttribute(renderer: any, key: string, value: any) {
    renderer.setAttribute(key, value);
  },
};

const fakeAction = (overrides: any = {}): Action =>
  Object.assign(Object.create(Action.prototype), {
    source: 0,
    target: 1,
    _source: undefined,
    _target: undefined,
    reverse: false,
    entity: defaultEntity,
    ...overrides,
  });

describe("Interp.numberInterp", () => {
  it("blends source → target linearly", () => {
    const target = mockTarget();
    const interp = Interp.numberInterp(target, "x");
    const a = fakeAction({ source: 0, target: 10 });
    interp.call(a, 0);
    interp.call(a, 0.3);
    interp.call(a, 1);
    expect(target.setAttribute.mock.calls).toEqual([
      ["x", 0],
      ["x", 3],
      ["x", 10],
    ]);
  });
});

describe("Interp.pixelInterp", () => {
  it("formats blended number with px suffix", () => {
    const target = mockTarget();
    const interp = Interp.pixelInterp(target, "width");
    interp.call(fakeAction({ source: 0, target: 20 }), 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith("width", "10px");
  });
});

describe("Interp.exLengthInterp", () => {
  it("parses Nex strings on init then blends with ex suffix", () => {
    const target = mockTarget();
    const interp = Interp.exLengthInterp(target, "height");
    const a = fakeAction({ source: "2ex", target: "6ex" });
    interp.onInit(a);
    interp.call(a, 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith("height", "4ex");
  });
});

describe("Interp.vectorInterp", () => {
  it("blends 2-element vector componentwise", () => {
    const target = mockTarget();
    const interp = Interp.vectorInterp(target, "translate");
    interp.call(fakeAction({ source: [0, 0], target: [10, 20] }), 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith("translate", [5, 10]);
  });
});

describe("Interp.arrayInterp", () => {
  it("pads missing elements with 0 when source/target lengths differ", () => {
    const target = mockTarget();
    const interp = Interp.arrayInterp(target, "values");
    const a = fakeAction({ source: [10, 10], target: [0, 0, 20] });
    interp.onInit(a);
    interp.call(a, 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith("values", [5, 5, 10]);
  });

  it("wraps a scalar source as [scalar]", () => {
    const target = mockTarget();
    const interp = Interp.arrayInterp(target, "values");
    const a = fakeAction({ source: 4, target: [0, 8] });
    interp.onInit(a);
    interp.call(a, 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith("values", [2, 4]);
  });
});

describe("Interp.matrixInterp", () => {
  it("formats blended a..f as matrix(...) string", () => {
    const target = mockTarget();
    const interp = Interp.matrixInterp(target, "transform");
    const A = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    const B = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
    interp.call(fakeAction({ source: A, target: B }), 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith(
      "transform",
      "matrix(0.5, 1, 1.5, 2, 2.5, 3)",
    );
  });
});

describe("Interp.boxInterp", () => {
  it("formats x/y/width/height as space-joined viewBox string", () => {
    const target = mockTarget();
    const interp = Interp.boxInterp(target, "viewBox");
    const A = { x: 0, y: 0, width: 0, height: 0 };
    const B = { x: 10, y: 20, width: 100, height: 200 };
    interp.call(fakeAction({ source: A, target: B }), 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith(
      "viewBox",
      "5 10 50 100",
    );
  });
});

describe("Interp.translateInterp", () => {
  it("formats as translate(tx,ty) string", () => {
    const target = mockTarget();
    const interp = Interp.translateInterp(target, "transform");
    interp.call(fakeAction({ source: [0, 0], target: [10, 20] }), 0.5);
    expect(target.setAttribute).toHaveBeenLastCalledWith(
      "transform",
      "translate(5,10)",
    );
  });
});

describe("Interp.stringInterp", () => {
  it("forward: sets target only at t=1, ignores intermediate", () => {
    const target = mockTarget();
    const interp = Interp.stringInterp(target, "label");
    const a = fakeAction({ source: "old", target: "new", reverse: false });
    interp.call(a, 0);
    interp.call(a, 0.5);
    expect(target.setAttribute).not.toHaveBeenCalled();
    interp.call(a, 1);
    expect(target.setAttribute).toHaveBeenCalledWith("label", "new");
  });

  it("reverse: sets target at t=0 instead of t=1", () => {
    const target = mockTarget();
    const interp = Interp.stringInterp(target, "label");
    const a = fakeAction({ source: "old", target: "new", reverse: true });
    interp.call(a, 0);
    expect(target.setAttribute).toHaveBeenCalledWith("label", "new");
  });
});

describe("Interp.stringBlankInMiddleInterp", () => {
  it("sets blank at t=0 and target at t=1", () => {
    const target = mockTarget();
    const interp = Interp.stringBlankInMiddleInterp(target, "label");
    const a = fakeAction({ source: "old", target: "new" });
    interp.call(a, 0);
    interp.call(a, 0.5);
    interp.call(a, 1);
    expect(target.setAttribute.mock.calls).toEqual([
      ["label", " "],
      ["label", "new"],
    ]);
  });
});

describe("Interp.colorInterp", () => {
  it("blends RGBA channels componentwise", () => {
    const target = mockTarget();
    const interp = Interp.colorInterp(target, "fill");
    const a = fakeAction({
      source: { r: 0, g: 0, b: 0, a: 1 },
      target: { r: 100, g: 100, b: 100, a: 0 },
    });
    interp.onInit(a);
    interp.call(a, 0.5);
    const [, value] = target.setAttribute.mock.calls.at(-1)!;
    expect(value).toEqual({ r: 50, g: 50, b: 50, a: 0.5 });
  });

  it("accepts hex color strings via Color.toRGBA on init", () => {
    const target = mockTarget();
    const interp = Interp.colorInterp(target, "fill");
    const a = fakeAction({ source: "#000000", target: "#ffffff" });
    interp.onInit(a);
    interp.call(a, 0.5);
    const [, value] = target.setAttribute.mock.calls.at(-1)!;
    expect(value).toEqual({ r: 127.5, g: 127.5, b: 127.5, a: 1 });
  });
});

describe("Interp.pointsInterp", () => {
  it("pads shorter point list by repeating its last point", () => {
    const target = mockTarget();
    const interp = Interp.pointsInterp(target, "points");
    const a = fakeAction({
      source: [
        [0, 0],
        [10, 10],
      ],
      target: [
        [0, 0],
        [10, 10],
        [20, 20],
      ],
    });
    interp.onInit(a);
    interp.call(a, 0.5);
    const [, value] = target.setAttribute.mock.calls.at(-1)!;
    expect(value).toEqual([
      [0, 0],
      [10, 10],
      [15, 15],
    ]);
  });
});

describe("Interp.emptyInterp", () => {
  it("does nothing at any t", () => {
    const target = mockTarget();
    const interp = Interp.emptyInterp(target, "x");
    interp.call(fakeAction(), 0);
    interp.call(fakeAction(), 0.5);
    interp.call(fakeAction(), 1);
    expect(target.setAttribute).not.toHaveBeenCalled();
  });
});

describe("brand discrimination", () => {
  it("every Interp.* static is recognized as an InterpCreator", () => {
    expect(isInterpCreator(Interp.numberInterp)).toBe(true);
    expect(isInterpCreator(Interp.colorInterp)).toBe(true);
    expect(isInterpCreator(Interp.pathInterp)).toBe(true);
    expect(isInterpCreator(Interp.emptyInterp)).toBe(true);
  });

  it("a plain (obj, key) => InterpObject function is NOT a creator unless branded", () => {
    const userFactory = (object: any, key: string) =>
      new InterpObject(() => {});
    expect(isInterpCreator(userFactory)).toBe(false);
  });

  it("lazyInterp() wraps a function so isLazyInterpFunction recognizes it", () => {
    const branded = lazyInterp((l, r, s, t) => {});
    expect(isLazyInterpFunction(branded)).toBe(true);
  });

  it("an unbranded 4-arg function is NOT a LazyInterpFunction", () => {
    const bare = (l: number, r: number, s: any, t: any) => {};
    expect(isLazyInterpFunction(bare)).toBe(false);
  });

  it("type guards reject non-functions cleanly", () => {
    expect(isInterpCreator(null)).toBe(false);
    expect(isInterpCreator({})).toBe(false);
    expect(isLazyInterpFunction(undefined)).toBe(false);
    expect(isLazyInterpFunction(42)).toBe(false);
  });
});

describe("InterpObject lifecycle", () => {
  it("onInit fires only once across multiple onInit dispatches", () => {
    const init = vi.fn();
    const obj = new InterpObject(() => {}).onInit(init);
    const a = fakeAction();
    obj.onInit(a);
    obj.onInit(a);
    obj.onInit(a);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("onBeforeInterp/onAfterInterp fire every time they are dispatched", () => {
    const before = vi.fn();
    const after = vi.fn();
    const obj = new InterpObject(() => {})
      .onBeforeInterp(before)
      .onAfterInterp(after);
    const a = fakeAction();
    obj.onBeforeInterp(a);
    obj.onBeforeInterp(a);
    obj.onAfterInterp(a);
    expect(before).toHaveBeenCalledTimes(2);
    expect(after).toHaveBeenCalledTimes(1);
  });
});

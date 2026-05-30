import { beforeEach, describe, expect, it, vi } from "vitest";
import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";

const linear = (t: number) => t;

const buildAction = (l: number, r: number, source: any, target: any, key = "x") => {
    const entity = { setAttribute: vi.fn(), id: 1 };
    const interp = Interp.numberInterp(entity, key);
    const action = new Action(l, r, source, target, interp, linear, entity as any, key);
    return { action, entity };
};

beforeEach(() => {
    Window.ACTION_DELAY = 0;
    Window.CURRENT_FRAME = 0;
});

describe("Action construction", () => {
    it("stores the supplied range and shifts by Window.ACTION_DELAY", () => {
        Window.ACTION_DELAY = 50;
        const { action } = buildAction(0, 100, 0, 10);
        expect(action.l).toBe(50);
        expect(action.r).toBe(150);
    });

    it("captures Window.CURRENT_FRAME at construction time", () => {
        Window.CURRENT_FRAME = 7;
        const { action } = buildAction(0, 100, 0, 10);
        expect(action.frame).toBe(7);
    });

    it("starts with firstCallFlag set and is not stopped", () => {
        const { action } = buildAction(0, 100, 0, 10);
        expect(action.is(Action.firstCallFlag)).toBe(true);
        expect(action.is(Action.stopFlag)).toBe(false);
        expect(action.is(Action.hideFlag)).toBe(false);
    });
});

describe("Action.tick lifecycle", () => {
    it("returns false when ticked before its start", () => {
        const { action } = buildAction(10, 100, 0, 10);
        expect(action.tick(5)).toBe(false);
    });

    it("at the boundary t=l, interp fires with k1=0 — writes source value", () => {
        const { action, entity } = buildAction(0, 100, 0, 10);
        action.tick(0);
        expect(entity.setAttribute).toHaveBeenLastCalledWith("x", 0);
    });

    it("mid-interval, interp fires with the eased fraction", () => {
        const { action, entity } = buildAction(0, 100, 0, 10);
        action.tick(0); // first tick consumes firstCallFlag
        action.tick(50);
        expect(entity.setAttribute).toHaveBeenLastCalledWith("x", 5);
    });

    it("at t>=r, sets stopFlag and writes target value", () => {
        const { action, entity } = buildAction(0, 100, 0, 10);
        action.tick(0);
        action.tick(100);
        expect(action.is(Action.stopFlag)).toBe(true);
        expect(entity.setAttribute).toHaveBeenLastCalledWith("x", 10);
    });

    it("zero-length action (l===r) reaches stopFlag in one tick", () => {
        const { action, entity } = buildAction(0, 0, 0, 10);
        action.tick(0);
        expect(action.is(Action.stopFlag)).toBe(true);
        expect(entity.setAttribute).toHaveBeenLastCalledWith("x", 10);
    });
});

describe("Action.forceToFinish", () => {
    it("drives the action to stopFlag regardless of timeline position", () => {
        const { action, entity } = buildAction(0, 100, 0, 10);
        action.forceToFinish();
        expect(action.is(Action.stopFlag)).toBe(true);
        expect(entity.setAttribute).toHaveBeenLastCalledWith("x", 10);
    });
});

describe("Action flag helpers", () => {
    it("is / set / unset compose bitflags correctly", () => {
        const { action } = buildAction(0, 100, 0, 10);
        action.set(Action.stopFlag);
        expect(action.is(Action.stopFlag)).toBe(true);
        action.set(Action.hideFlag);
        expect(action.is(Action.stopFlag)).toBe(true);
        expect(action.is(Action.hideFlag)).toBe(true);
        action.unset(Action.stopFlag);
        expect(action.is(Action.stopFlag)).toBe(false);
        expect(action.is(Action.hideFlag)).toBe(true);
    });
});

describe("Action.fromAction (clone)", () => {
    it("copies range, source/target, interp, entity, animatedKey, frame", () => {
        const { action } = buildAction(0, 100, 0, 10, "opacity");
        const clone = Action.fromAction(action);
        expect(clone.l).toBe(action.l);
        expect(clone.r).toBe(action.r);
        expect(clone.source).toBe(action.source);
        expect(clone.target).toBe(action.target);
        expect(clone.interp).toBe(action.interp);
        expect(clone.entity).toBe(action.entity);
        expect(clone.animatedKey).toBe("opacity");
        expect(clone.frame).toBe(action.frame);
    });

    it("preserves hideFlag from the original but always sets firstCallFlag fresh", () => {
        const { action } = buildAction(0, 100, 0, 10);
        action.set(Action.hideFlag);
        action.set(Action.stopFlag);
        action.unset(Action.firstCallFlag);

        const clone = Action.fromAction(action);
        expect(clone.is(Action.hideFlag)).toBe(true);
        expect(clone.is(Action.firstCallFlag)).toBe(true);
        expect(clone.is(Action.stopFlag)).toBe(false);
    });

    it("returns a distinct instance, not a reference to the original", () => {
        const { action } = buildAction(0, 100, 0, 10);
        const clone = Action.fromAction(action);
        expect(clone).not.toBe(action);
        expect(clone).toBeInstanceOf(Action);
    });
});

describe("Action.clone instance method", () => {
    it("returns undefined for lazy-interp actions (they cannot be replayed)", () => {
        const entity = { setAttribute: vi.fn(), id: 1 };
        const lazyInterp = (l: number, r: number, source: any, target: any) => {};
        const action = new Action(0, 100, 0, 10, lazyInterp, linear, entity as any, "x");
        expect(action.clone()).toBeUndefined();
    });

    it("delegates to fromAction for normal actions", () => {
        const { action } = buildAction(0, 100, 0, 10);
        const clone = action.clone();
        expect(clone).toBeInstanceOf(Action);
        expect(clone!.l).toBe(action.l);
    });
});

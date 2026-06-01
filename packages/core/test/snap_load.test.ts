import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

describe("snap load", () => {
  it("registers global Snap", () => {
    const snapPath = path.resolve(__dirname, "../../assets/snap.svg.js");
    const code = fs.readFileSync(snapPath, "utf8");
    // eslint-disable-next-line no-eval
    new Function(code).call(globalThis);
    const Snap = (globalThis as any).Snap;
    expect(Snap).toBeDefined();
    const parsed = Snap.parsePathString("M 0 10 L 20 30");
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0][0]).toBe("M");
  });
});

import { describe, expect, it } from "vitest";

import { PathEngine } from "@/node/path/path-engine";

describe("PathEngine.toOpers", () => {
  it("returns an empty array on empty input", () => {
    expect(PathEngine.toOpers("")).toEqual([]);
  });

  describe("absolute commands with explicit separators", () => {
    it("parses M and L", () => {
      expect(PathEngine.toOpers("M 0 0 L 10 20")).toEqual([
        ["M", 0, 0],
        ["L", 10, 20],
      ]);
    });

    it("parses C", () => {
      expect(PathEngine.toOpers("M 0 0 C 1 2 3 4 5 6")).toEqual([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
      ]);
    });

    it("parses H and V", () => {
      expect(PathEngine.toOpers("M 0 0 H 10 V 20")).toEqual([
        ["M", 0, 0],
        ["H", 10],
        ["V", 20],
      ]);
    });

    it("parses Q and T", () => {
      expect(PathEngine.toOpers("M 0 0 Q 1 2 3 4 T 5 6")).toEqual([
        ["M", 0, 0],
        ["Q", 1, 2, 3, 4],
        ["T", 5, 6],
      ]);
    });

    it("parses S after C", () => {
      expect(PathEngine.toOpers("M 0 0 C 1 2 3 4 5 6 S 7 8 9 10")).toEqual([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
        ["S", 7, 8, 9, 10],
      ]);
    });

    it("parses A (arc)", () => {
      expect(PathEngine.toOpers("M 0 0 A 5 5 0 0 1 10 10")).toEqual([
        ["M", 0, 0],
        ["A", 5, 5, 0, 0, 1, 10, 10],
      ]);
    });

    it("parses Z without parameters", () => {
      expect(PathEngine.toOpers("M 0 0 L 10 0 Z")).toEqual([
        ["M", 0, 0],
        ["L", 10, 0],
        ["Z"],
      ]);
    });
  });

  describe("relative commands", () => {
    it("preserves lowercase letters", () => {
      expect(PathEngine.toOpers("m 0 0 l 5 5 c 1 2 3 4 5 6 z")).toEqual([
        ["m", 0, 0],
        ["l", 5, 5],
        ["c", 1, 2, 3, 4, 5, 6],
        ["z"],
      ]);
    });

    it("parses a (arc relative)", () => {
      expect(PathEngine.toOpers("M 0 0 a 5 5 0 0 1 10 10")).toEqual([
        ["M", 0, 0],
        ["a", 5, 5, 0, 0, 1, 10, 10],
      ]);
    });
  });

  describe("implicit command continuation", () => {
    it("treats extra coordinates after M as implicit L", () => {
      expect(PathEngine.toOpers("M 0 0 10 20 30 40")).toEqual([
        ["M", 0, 0],
        ["L", 10, 20],
        ["L", 30, 40],
      ]);
    });

    it("treats extra coordinates after m as implicit l", () => {
      expect(PathEngine.toOpers("m 0 0 5 5")).toEqual([
        ["m", 0, 0],
        ["l", 5, 5],
      ]);
    });

    it("repeats L for trailing coordinate pairs", () => {
      expect(PathEngine.toOpers("L 1 2 3 4")).toEqual([
        ["L", 1, 2],
        ["L", 3, 4],
      ]);
    });

    it("repeats C for trailing six-tuples", () => {
      expect(PathEngine.toOpers("M 0 0 C 1 1 2 2 3 3 4 4 5 5 6 6")).toEqual([
        ["M", 0, 0],
        ["C", 1, 1, 2, 2, 3, 3],
        ["C", 4, 4, 5, 5, 6, 6],
      ]);
    });
  });

  describe("number formats", () => {
    it("accepts comma separators", () => {
      expect(PathEngine.toOpers("M 0,0 L 10,20")).toEqual([
        ["M", 0, 0],
        ["L", 10, 20],
      ]);
    });

    it("treats a leading minus sign as a separator", () => {
      expect(PathEngine.toOpers("M 0 0L10-20")).toEqual([
        ["M", 0, 0],
        ["L", 10, -20],
      ]);
    });

    it("accepts decimals with a leading or trailing dot", () => {
      expect(PathEngine.toOpers("M .5 1. L 2.5 3.")).toEqual([
        ["M", 0.5, 1],
        ["L", 2.5, 3],
      ]);
    });

    it("accepts scientific notation", () => {
      expect(PathEngine.toOpers("M 1e2 2E-1")).toEqual([["M", 100, 0.2]]);
    });
  });
});

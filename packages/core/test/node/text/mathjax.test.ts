import { describe, expect, it, vi } from "vitest";

import { MathManager } from "@/node/text/text-engine/mathjax";

const SVG_NS = "http://www.w3.org/2000/svg";

// Builds the minimum DOM `getMathPaths` walks: <svg> → <defs>, <g> root,
// one <use>. Root has no transform so dfs is a no-op and the morph path
// arrives with the matrix returned by initialMatrix unmodified, letting
// this test verify the formula in isolation. The interaction between
// initialMatrix and dfs walking MathJax's root transforms (scale(1,-1) /
// scale(0.8) / translate(-ibbox.x, 0)) is verified end-to-end in
// production browsers; happy-dom's DOMMatrix.multiply(SVGMatrix) loses
// translation, so reproducing the full walk here would test happy-dom's
// bug rather than the formula.
function buildBareMath() {
  const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
  const defs = document.createElementNS(SVG_NS, "defs");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("id", "P0");
  path.setAttribute("d", "M0 0Z");
  defs.appendChild(path);
  const root = document.createElementNS(SVG_NS, "g") as SVGGElement;
  const use = document.createElementNS(SVG_NS, "use") as SVGUseElement;
  use.setAttribute("xlink:href", "#P0");
  root.appendChild(use);
  svg.appendChild(defs);
  svg.appendChild(root);
  document.body.appendChild(svg);
  return { element: () => svg, __append: () => {}, __remove: () => {} } as any;
}

// (bbox, ibbox) captured from MathJax tex2svg("\sum_{i=1}^n i") rendered
// at fontSize=20 in Chromium. The Σ glyph (data-c="2211") sits at root
// local (0, 0).
const SIGMA_BBOX = {
  x: 5.666388034820557,
  y: -33.513301849365234,
  width: 48.67286682128906,
  height: 67.026611328125,
};
const SIGMA_IBBOX = {
  x: 55,
  y: -1095.677001953125,
  width: 1857.699951171875,
  height: 2558.208251953125,
};

// initialMatrix's formula in plain form, for hand-computing expectations
// without re-invoking the production code path. Lives in the test (not
// imported from production) so a regression in the formula doesn't drift
// the expectation alongside the broken behavior.
const SIGMA_SCALE = SIGMA_BBOX.width / SIGMA_IBBOX.width;
const SIGMA_E = SIGMA_BBOX.x;
const SIGMA_F =
  SIGMA_BBOX.y + (SIGMA_IBBOX.y + SIGMA_IBBOX.height) * SIGMA_SCALE;

function callMathPaths() {
  const spy = vi
    .spyOn(MathManager, "boundingBoxAndInnerBoundingBox")
    .mockReturnValue([SIGMA_BBOX as DOMRect, SIGMA_IBBOX as DOMRect]);
  try {
    return MathManager.getMathPaths(buildBareMath());
  } finally {
    spy.mockRestore();
  }
}

describe("MathManager.getMathPaths (initialMatrix formula)", () => {
  it("places root local origin at the formula's e / f", () => {
    const [pv] = callMathPaths();
    const p = (pv.transform as DOMMatrix).transformPoint({ x: 0, y: 0 });
    expect(p.x).toBeCloseTo(SIGMA_E, 6);
    expect(p.y).toBeCloseTo(SIGMA_F, 6);
  });

  it("scales x by bbox.width / ibbox.width", () => {
    const [pv] = callMathPaths();
    const localX = SIGMA_IBBOX.width;
    const p = (pv.transform as DOMMatrix).transformPoint({ x: localX, y: 0 });
    expect(p.x).toBeCloseTo(SIGMA_E + SIGMA_SCALE * localX, 6);
    expect(p.y).toBeCloseTo(SIGMA_F, 6);
  });

  it("scales y by bbox.width / ibbox.width", () => {
    const [pv] = callMathPaths();
    const localY = SIGMA_IBBOX.height;
    const p = (pv.transform as DOMMatrix).transformPoint({ x: 0, y: localY });
    expect(p.x).toBeCloseTo(SIGMA_E, 6);
    expect(p.y).toBeCloseTo(SIGMA_F + SIGMA_SCALE * localY, 6);
  });

  // Hard-coded number pinned against the SIGMA_* constants drifting in
  // lockstep with a broken formula: dropping the (ibbox.y + ibbox.height)
  // × scale term on the Σ fixture drives f from +4.806 to bbox.y = -33.5,
  // which this catches without consulting the formula at all.
  it("f compensates for MathJax's scale(1,-1) y-flip", () => {
    const [pv] = callMathPaths();
    const p = (pv.transform as DOMMatrix).transformPoint({ x: 0, y: 0 });
    expect(p.y).toBeCloseTo(4.806, 2);
  });
});

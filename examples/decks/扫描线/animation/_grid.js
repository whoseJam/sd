// Coordinate helpers for a W × H logical grid centered on the canvas.
// sd-animation auto-fits the viewBox to the rendered content bounds (the
// iframe negotiates this with the parent via postMessage, so the host slide
// just sets <sd-animation style="width: ...; height: ..."> and sd handles the
// rest). UNIT here is just the SVG-unit size of one cell — it sets the
// relative visual weight of strokes / fonts / spacing, not the final pixel
// size on screen.

export function gridHelpers(W, H, UNIT = 40) {
  const X0 = (-W * UNIT) / 2;
  const Y0 = (-H * UNIT) / 2;
  return {
    UNIT,
    X0,
    Y0,
    gx: (lx) => X0 + lx * UNIT,
    gy: (ly) => Y0 + ly * UNIT,
  };
}

// Minimal coord helper for the 扫描线 deck animations.
// Centers a W×H logical grid on the canvas with UNIT px per logical unit.
// gx / gy convert from logical coords to sd's math y-up world coords —
// pass the logical bottom-y of a Rect (sd renders y as the bottom edge).

export function gridHelpers(W, H, UNIT) {
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

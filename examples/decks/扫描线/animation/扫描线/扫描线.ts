import * as sd from "@/sd";
import { gridHelpers } from "../_grid";

const svg = sd.svg();
const C = sd.color();

// sd renders with y growing upward (canvas center is origin; Rect.y is the
// bottom edge of the rect, Line.y is plain y-up). All the math below is in
// that y-up logical frame; the renderer handles the actual SVG flip.
const W = 20;
const H = 10;
const { UNIT, gx, gy, Y0 } = gridHelpers(W, H, 28);
const STRIP_GAP = 14;
const STRIP_H = 14;
// Strip sits below the frame; its rect.y is the strip's lower edge in y-up.
const STRIP_Y = Y0 - STRIP_GAP - STRIP_H;

const NEUTRAL = "#d0d0d0";
const RECT_STROKE = "#666";
const SWEPT = "#f58617";

const data = [
  [1, 1, 5, 3],
  [8, 5, 7, 2],
  [13, 6, 4, 3],
];

const events = [];
const cells = [];
const segment = sd.make1d(W, 0);

function coverageColor(count) {
  if (count <= 0) return C.white;
  if (count === 1) return "#fbd2a3";
  if (count === 2) return "#f5995a";
  return "#d96a1f";
}

sd.init(() => {
  new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: W * UNIT,
    height: H * UNIT,
    fill: C.none,
    stroke: NEUTRAL,
    strokeWidth: 1,
  });

  data.forEach(([x, y, w, h]) => {
    new sd.Rect({
      targetNode: svg,
      x: gx(x),
      y: gy(y),
      width: w * UNIT,
      height: h * UNIT,
      fill: NEUTRAL,
      fillOpacity: 0.35,
      stroke: RECT_STROKE,
      strokeWidth: 1,
    });
    events.push({ x, w, eventY: y, type: +1 });
    events.push({ x, w, eventY: y + h, type: -1 });
  });

  for (let i = 0; i < W; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(i),
        y: STRIP_Y,
        width: UNIT,
        height: STRIP_H,
        fill: C.white,
        stroke: NEUTRAL,
        strokeWidth: 0.5,
      }),
    );
  }
});

sd.main(async () => {
  events.sort((a, b) => a.eventY - b.eventY);
  await sd.pause();

  const line = new sd.Line({
    targetNode: svg,
    x1: gx(0),
    y1: gy(0),
    x2: gx(W),
    y2: gy(0),
    stroke: C.red,
    strokeWidth: 3,
    opacity: 0,
  });
  line.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  await sd.pause();

  let prevY = 0;
  for (const ev of events) {
    const dy = ev.eventY - prevY;
    if (dy > 0) {
      for (let l = 0, r; l < W; l = r + 1) {
        r = l;
        if (segment[l] === 0) continue;
        while (r + 1 < W && segment[r + 1] > 0) r++;
        const band = new sd.Rect({
          targetNode: svg,
          x: gx(l),
          y: gy(prevY),
          width: (r - l + 1) * UNIT,
          height: 0,
          fill: SWEPT,
          fillOpacity: 0.32,
          stroke: C.none,
        });
        band
          .startAnimate({ duration: 600 })
          .setHeight(dy * UNIT)
          .endAnimate();
      }
    }
    line
      .startAnimate({ duration: 600 })
      .setY1(gy(ev.eventY))
      .setY2(gy(ev.eventY))
      .endAnimate();
    prevY = ev.eventY;
    await sd.pause();

    for (let i = ev.x; i < ev.x + ev.w; i++) {
      segment[i] += ev.type;
      cells[i]
        .startAnimate({ duration: 400 })
        .setFill(coverageColor(segment[i]))
        .endAnimate();
    }
    await sd.pause();
  }
});

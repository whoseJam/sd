import * as sd from "@/sd";

// Same setup as 思路转换, but the sequence [2,4,2,4,6,2,3,4] has repeats
// close together: the union of contribution rectangles fails to cover the
// full upper triangle r >= l, so some subintervals are non-unique and the
// sequence is "boring".

const svg = sd.svg();
const C = sd.color();

const data = [2, 4, 2, 4, 6, 2, 3, 4];
const N = data.length;
const CELL = 44;
const PLANE = 32;
const GAP = 36;
const TOTAL_H = CELL + GAP + N * PLANE;
const X0 = (-N * CELL) / 2;
const ARR_Y = TOTAL_H / 2 - CELL;
const PLANE_X0 = (-N * PLANE) / 2;
const PLANE_Y0 = ARR_Y - GAP - N * PLANE;

const FOCUS = "#f14c4c";
const RANGE = "#4a90e2";
const FILL = "#5cb85c";
const GREY = "#aaa";
const GRID = "#d8d8d8";

const arrLeft = (i) => X0 + i * CELL;
const arrMid = (i) => X0 + (i + 0.5) * CELL;
const planeX = (l) => PLANE_X0 + l * PLANE;
const planeY = (r) => PLANE_Y0 + r * PLANE;

const rects = [];
const labels = [];

sd.init(() => {
  for (let i = 0; i < N; i++) {
    rects.push(
      new sd.Rect({
        targetNode: svg,
        x: arrLeft(i),
        y: ARR_Y,
        width: CELL,
        height: CELL,
        fill: C.white,
        stroke: GREY,
        strokeWidth: 1.5,
      }),
    );
    labels.push(
      new sd.Text({
        targetNode: svg,
        text: String(data[i]),
        cx: arrMid(i),
        cy: ARR_Y + CELL / 2,
        fontSize: 20,
        fill: "#222",
      }),
    );
  }

  for (let i = 0; i <= N; i++) {
    new sd.Line({ targetNode: svg, x1: planeX(i), y1: PLANE_Y0, x2: planeX(i), y2: PLANE_Y0 + N * PLANE, stroke: GRID, strokeWidth: 1 });
    new sd.Line({ targetNode: svg, x1: PLANE_X0, y1: planeY(i), x2: PLANE_X0 + N * PLANE, y2: planeY(i), stroke: GRID, strokeWidth: 1 });
  }
  new sd.Text({ targetNode: svg, text: "l", cx: PLANE_X0 + N * PLANE + 12, cy: PLANE_Y0 + N * PLANE, fontSize: 14, fill: "#666" });
  new sd.Text({ targetNode: svg, text: "r", cx: PLANE_X0, cy: PLANE_Y0 - 10, fontSize: 14, fill: "#666" });
});

function makeBracket(a, b, side, label) {
  const x1 = arrLeft(a);
  const x2 = arrLeft(b) + CELL;
  const baseY = side === "top" ? ARR_Y + CELL + 10 : ARR_Y - 10;
  const tickDir = side === "top" ? -5 : 5;
  const labelY = side === "top" ? baseY + 12 : baseY - 12;
  const items = [
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2, y2: baseY, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2: x1, y2: baseY + tickDir, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1: x2, y1: baseY, x2, y2: baseY + tickDir, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Text({ targetNode: svg, text: label, cx: (x1 + x2) / 2, cy: labelY, fontSize: 13, fill: RANGE, opacity: 0 }),
  ];
  for (const item of items) item.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
  return items;
}

function fadeOut(items) {
  for (const item of items) item.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
}

sd.main(async () => {
  await sd.pause();

  for (let i = 0; i < N; i++) {
    let L = -1;
    for (let k = i - 1; k >= 0; k--) if (data[k] === data[i]) { L = k; break; }
    let R = N;
    for (let k = i + 1; k < N; k++) if (data[k] === data[i]) { R = k; break; }

    rects[i].startAnimate({ duration: 300 }).setStroke(FOCUS).setFill("#fdecec").endAnimate();
    labels[i].startAnimate({ duration: 300 }).setFill(FOCUS).endAnimate();
    await sd.pause();

    const top = makeBracket(L + 1, i, "top", "[L+1, i]");
    const bot = makeBracket(i, R - 1, "bottom", "[i, R-1]");
    await sd.pause();

    const lo = L + 1;
    const hi = i;
    const ro = i;
    const rhi = R - 1;
    new sd.Rect({
      targetNode: svg,
      x: planeX(lo),
      y: planeY(ro),
      width: (hi - lo + 1) * PLANE,
      height: (rhi - ro + 1) * PLANE,
      fill: FILL,
      fillOpacity: 0,
      stroke: C.none,
    }).startAnimate({ duration: 300 }).setFillOpacity(0.35).endAnimate();
    await sd.pause();

    fadeOut(top);
    fadeOut(bot);
    rects[i].startAnimate({ duration: 300 }).setStroke(GREY).setFill(C.white).endAnimate();
    labels[i].startAnimate({ duration: 300 }).setFill("#222").endAnimate();
  }
});

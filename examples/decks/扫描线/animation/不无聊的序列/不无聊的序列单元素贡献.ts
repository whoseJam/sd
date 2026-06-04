import * as sd from "@/sd";

// For each element a_i in a row of cells, sweep i = 0..N-1:
// find L_i (nearest equal on the left) and R_i (on the right). Subintervals
// with left in [L_i+1, i] and right in [i, R_i-1] are all uniquely
// witnessed by a_i — shown as a top bracket over [L+1, i] (left-endpoint
// range) and a bottom bracket over [i, R-1] (right-endpoint range).

const svg = sd.svg();
const C = sd.color();

const data = [2, 4, 3, 4, 6, 2, 3, 4];
const N = data.length;
const UNIT = 60;
const X0 = (-N * UNIT) / 2;
const CELL_Y = -UNIT / 2;

const FOCUS = "#f14c4c";
const RANGE = "#4a90e2";
const GREY = "#aaa";

const cellLeft = (i) => X0 + i * UNIT;
const cellMid = (i) => X0 + (i + 0.5) * UNIT;

const cells = [];
const labels = [];

sd.init(() => {
  for (let i = 0; i < N; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: cellLeft(i),
        y: CELL_Y,
        width: UNIT,
        height: UNIT,
        fill: C.white,
        stroke: GREY,
        strokeWidth: 1.5,
      }),
    );
    labels.push(
      new sd.Text({
        targetNode: svg,
        text: String(data[i]),
        cx: cellMid(i),
        cy: 0,
        fontSize: 26,
        fill: "#222",
      }),
    );
  }
});

function makeBracket(a, b, side, label) {
  const x1 = cellLeft(a);
  const x2 = cellLeft(b) + UNIT;
  const baseY = side === "top" ? UNIT / 2 + 14 : -UNIT / 2 - 14;
  const tickDir = side === "top" ? -6 : 6;
  const labelY = side === "top" ? baseY + 12 : baseY - 12;
  const items = [
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2, y2: baseY, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2: x1, y2: baseY + tickDir, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1: x2, y1: baseY, x2, y2: baseY + tickDir, stroke: RANGE, strokeWidth: 1.5, opacity: 0 }),
    new sd.Text({ targetNode: svg, text: label, cx: (x1 + x2) / 2, cy: labelY, fontSize: 16, fill: RANGE, opacity: 0 }),
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

    cells[i].startAnimate({ duration: 300 }).setStroke(FOCUS).setFill("#fdecec").endAnimate();
    labels[i].startAnimate({ duration: 300 }).setFill(FOCUS).endAnimate();
    await sd.pause();

    const top = makeBracket(L + 1, i, "top", "[L+1, i]");
    const bot = makeBracket(i, R - 1, "bottom", "[i, R-1]");
    await sd.pause();

    fadeOut(top);
    fadeOut(bot);
    cells[i].startAnimate({ duration: 300 }).setStroke(GREY).setFill(C.white).endAnimate();
    labels[i].startAnimate({ duration: 300 }).setFill("#222").endAnimate();
    await sd.pause();
  }
});

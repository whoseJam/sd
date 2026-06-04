import * as sd from "@/sd";

// For each a_i in the row, highlight the cell and draw two brackets that
// trace the left-endpoint range [L_i+1, i] above the array and the right-
// endpoint range [i, R_i-1] below. The two brackets visualize the rule
// "a_i uniquely witnesses any subinterval with left in one range and right
// in the other" — the rectangle that the next slide plots in the (l, r)-
// plane comes from exactly these two ranges.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [2, 4, 3, 4, 6, 2, 3, 4];
const N = data.length;
const UNIT = 60;
const X0 = 0;
const ARR_Y = 0;

const TEXT_DARK = C.black;

const cellLeft = (i: number) => X0 + i * UNIT;
const cellMid = (i: number) => X0 + (i + 0.5) * UNIT;

const cells: sd.Rect[] = [];
const labels: sd.Text[] = [];

sd.init(() => {
  for (let i = 0; i < N; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: cellLeft(i),
        y: ARR_Y,
        width: UNIT,
        height: UNIT,
        fill: C.white,
        stroke: C.grey,
        strokeWidth: 1.5,
        opacity: 0,
      }),
    );
    labels.push(
      new sd.Text({
        targetNode: svg,
        text: String(data[i]),
        cx: cellMid(i),
        cy: ARR_Y + UNIT / 2,
        fontSize: 26,
        fill: TEXT_DARK,
        opacity: 0,
      }),
    );
  }
});

function bracket(a: number, b: number, side: "above" | "below", label: string) {
  const x1 = cellLeft(a);
  const x2 = cellLeft(b) + UNIT;
  const baseY = side === "above" ? ARR_Y - 14 : ARR_Y + UNIT + 14;
  const tickDir = side === "above" ? 6 : -6;
  const labelY = side === "above" ? baseY - 14 : baseY + 14;
  const items: sd.SDNode[] = [
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2, y2: baseY, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2: x1, y2: baseY + tickDir, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1: x2, y1: baseY, x2, y2: baseY + tickDir, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Text({ targetNode: svg, text: label, cx: (x1 + x2) / 2, cy: labelY, fontSize: 16, fill: C.blue, opacity: 0 }),
  ];
  for (const item of items) {
    item.startAnimate({ duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  return items;
}

function fadeOut(items: sd.SDNode[]) {
  for (const item of items) {
    item.startAnimate({ duration: 260, easing: E.easeOut }).setOpacity(0).endAnimate();
  }
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    cells[i].startAnimate({ delay: i * 50, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
    labels[i].startAnimate({ delay: 100 + i * 50, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
  }

  await sd.pause();

  for (let i = 0; i < N; i++) {
    let L = -1;
    for (let k = i - 1; k >= 0; k--) if (data[k] === data[i]) { L = k; break; }
    let R = N;
    for (let k = i + 1; k < N; k++) if (data[k] === data[i]) { R = k; break; }

    if (i > 0) {
      cells[i - 1].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.grey).endAnimate();
      labels[i - 1].startAnimate({ duration: 260, easing: E.easeOut }).setFill(TEXT_DARK).endAnimate();
    }
    cells[i].raise();
    labels[i].raise();
    cells[i].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.red).endAnimate();
    labels[i].startAnimate({ duration: 260, easing: E.easeOut }).setFill(C.red).endAnimate();
    await sd.pause();

    const above = bracket(L + 1, i, "above", "[L+1, i]");
    const below = bracket(i, R - 1, "below", "[i, R-1]");
    await sd.pause();

    fadeOut(above);
    fadeOut(below);
  }

  cells[N - 1].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.grey).endAnimate();
  labels[N - 1].startAnimate({ duration: 260, easing: E.easeOut }).setFill(TEXT_DARK).endAnimate();

  await sd.pause();
});

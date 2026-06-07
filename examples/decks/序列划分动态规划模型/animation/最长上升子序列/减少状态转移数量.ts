import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const VALID = C.steelBlue;
const INVALID = C.silver;

const data = [2, 1, 4, 3, 2, 5, 6, 4];
const N = data.length;
const MAX_V = Math.max(...data);

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 26;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

const BUCKET_W = 22;
const BUCKET_H = 16;
const BUCKET_X = cxOf(N) + CELL_W / 2 + 30;
const BUCKET_Y0 = CELL_H + 50;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}

const cells: Cell[] = [];
for (let i = 1; i <= N; i++) {
  const cx = cxOf(i);
  cells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: String(data[i - 1]),
      cx,
      cy: CELL_H / 2,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const iLabel = new sd.Math({
  targetNode: svg,
  text: "i",
  cx: cxOf(N),
  cy: -14,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});

interface Bucket {
  bg: sd.Rect;
  label: sd.Math;
}
const buckets: Bucket[] = [];
for (let v = 1; v <= MAX_V; v++) {
  const yB = BUCKET_Y0 + (MAX_V - v) * (BUCKET_H + 2);
  buckets.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: BUCKET_X - BUCKET_W / 2,
      y: yB,
      width: BUCKET_W,
      height: BUCKET_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    label: new sd.Math({
      targetNode: svg,
      text: `${v}`,
      cx: BUCKET_X + BUCKET_W / 2 + 10,
      cy: yB + BUCKET_H / 2,
      fontSize: 11,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const bucketTitle = new sd.Text({
  targetNode: svg,
  text: "桶 (按值)",
  cx: BUCKET_X,
  cy: BUCKET_Y0 + MAX_V * (BUCKET_H + 2) + 8,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

function makeArrow(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
): sd.Path {
  const mid = `${(fromX + toX) / 2} ${(fromY + toY) / 2 + 10}`;
  return new sd.Path({
    targetNode: svg,
    d: `M ${fromX} ${fromY} Q ${mid} ${toX} ${toY}`,
    stroke: color,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
}

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

const target = data[N - 1];

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  setFill(cells[N - 1].bg, I_HL, 200);
  setFill(cells[N - 1].text, "#ffffff", 280);
  fadeIn(iLabel, 280);
  await sd.pause();

  for (let i = 0; i < N - 1; i++) {
    const ok = data[i] < target;
    setFill(cells[i].bg, ok ? VALID : INVALID, i * 40);
    setFill(cells[i].text, "#ffffff", i * 40 + 60);
  }
  await sd.pause();

  for (let v = 0; v < MAX_V; v++) {
    fadeIn(buckets[v].bg, v * 30);
    fadeIn(buckets[v].label, v * 30 + 60);
  }
  fadeIn(bucketTitle, MAX_V * 30 + 80);
  await sd.pause();

  const arrows: sd.Path[] = [];
  for (let i = 0; i < N - 1; i++) {
    if (data[i] >= target) continue;
    const v = data[i];
    const fromX = cxOf(i + 1);
    const fromY = CELL_H;
    const toX = BUCKET_X - BUCKET_W / 2;
    const toY = BUCKET_Y0 + (MAX_V - v) * (BUCKET_H + 2) + BUCKET_H / 2;
    const arrow = makeArrow(fromX, fromY, toX, toY, VALID);
    arrows.push(arrow);
    fadeIn(arrow, i * 50);
  }
  await sd.pause();
});

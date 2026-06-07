import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const BIT_ON = C.steelBlue;
const BIT_OFF = C.silver;

const data = [1, 6, 2, 7, 4, 5, 6, 3, 2, 3];
const N = data.length;
const LOG_V = 3;
const I = N - 1;

const CELL_W = 38;
const CELL_GAP = 2;
const CELL_H = 22;
const STEP = CELL_W + CELL_GAP;
const BIT_H = 14;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;
const bitY = (b: number) => CELL_H + 6 + (LOG_V - 1 - b) * (BIT_H + 2);

function bin(v: number, bits: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < bits; i++) out.unshift(String((v >> i) & 1));
  return out;
}

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
  bits: sd.Rect[];
  bitTexts: sd.Text[];
}
const cells: Cell[] = data.map((v, i) => {
  const cx = cxOf(i);
  const bitStr = bin(v, LOG_V);
  const bits: sd.Rect[] = [];
  const bitTexts: sd.Text[] = [];
  for (let b = 0; b < LOG_V; b++) {
    const yB = bitY(b);
    const on = bitStr[LOG_V - 1 - b] === "1";
    bits.push(
      new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2 + 4,
        y: yB,
        width: CELL_W - 8,
        height: BIT_H,
        fill: on ? BIT_ON : "none",
        stroke: on ? "none" : BIT_OFF,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
    bitTexts.push(
      new sd.Text({
        targetNode: svg,
        text: on ? "1" : "0",
        cx,
        cy: yB + BIT_H / 2,
        fontSize: 11,
        fill: on ? "#ffffff" : BIT_OFF,
        opacity: 0,
      }),
    );
  }
  return {
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
      text: String(v),
      cx,
      cy: CELL_H / 2,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
    bits,
    bitTexts,
  };
});

const iLabel = new sd.Math({
  targetNode: svg,
  text: "i",
  cx: cxOf(I),
  cy: -14,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});

const BUCKET_X = cxOf(N - 1) + CELL_W / 2 + 36;
const BUCKET_W = 28;
const BUCKET_Y0 = CELL_H + 6;

interface Bucket {
  bg: sd.Rect;
  label: sd.Math;
}
const buckets: Bucket[] = Array.from({ length: LOG_V }, (_, b) => {
  const yB = BUCKET_Y0 + (LOG_V - 1 - b) * (BIT_H + 2);
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: BUCKET_X - BUCKET_W / 2,
      y: yB,
      width: BUCKET_W,
      height: BIT_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    label: new sd.Math({
      targetNode: svg,
      text: `\\text{bit}_${b}`,
      cx: BUCKET_X + BUCKET_W / 2 + 18,
      cy: yB + BIT_H / 2,
      fontSize: 11,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
});

const bucketTitle = new sd.Text({
  targetNode: svg,
  text: "桶 (按二进制位)",
  cx: BUCKET_X + 8,
  cy: 0,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    for (let b = 0; b < LOG_V; b++) {
      fadeIn(cells[i].bits[b], i * 20 + b * 15);
      fadeIn(cells[i].bitTexts[b], i * 20 + b * 15 + 30);
    }
  }
  fadeIn(iLabel, 200);
  await sd.pause();

  fadeIn(bucketTitle, 0);
  for (let b = 0; b < LOG_V; b++) {
    fadeIn(buckets[b].bg, b * 60);
    fadeIn(buckets[b].label, b * 60 + 40);
  }
  await sd.pause();
});

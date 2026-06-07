import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const VALID = C.steelBlue;
const INVALID = C.silver;

const str = "accbabbaac".split("");
const N = str.length;
const I = N - 1;
const charset = ["a", "b", "c"];

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 26;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = str.map((ch, i) => {
  const cx = cxOf(i);
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
      text: ch,
      cx,
      cy: CELL_H / 2,
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
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

const BUCKET_W = 26;
const BUCKET_H = 20;
const BUCKET_X = cxOf(N - 1) + CELL_W / 2 + 30;
const BUCKET_Y0 = CELL_H + 6;

interface Bucket {
  bg: sd.Rect;
  label: sd.Text;
}
const buckets: Bucket[] = charset.map((c, idx) => {
  const yB = BUCKET_Y0 + (charset.length - 1 - idx) * (BUCKET_H + 2);
  return {
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
    label: new sd.Text({
      targetNode: svg,
      text: c,
      cx: BUCKET_X + BUCKET_W / 2 + 12,
      cy: yB + BUCKET_H / 2,
      fontSize: 12,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
});

const bucketTitle = new sd.Text({
  targetNode: svg,
  text: "桶 (按字符)",
  cx: BUCKET_X + 5,
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
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  setFill(cells[I].bg, I_HL, 250);
  setFill(cells[I].text, "#ffffff", 320);
  fadeIn(iLabel, 320);
  await sd.pause();

  // c is current; bc is banned, so cells with char 'b' immediately before are invalid.
  for (let i = 0; i < I; i++) {
    const ch = str[i];
    setFill(cells[i].bg, ch !== "b" ? VALID : INVALID, i * 30);
    setFill(cells[i].text, "#ffffff", i * 30 + 60);
  }
  await sd.pause();

  fadeIn(bucketTitle, 0);
  for (let k = 0; k < buckets.length; k++) {
    fadeIn(buckets[k].bg, k * 80);
    fadeIn(buckets[k].label, k * 80 + 50);
  }
  await sd.pause();
});

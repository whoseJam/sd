import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const r = 50;
const cx1 = -30;
const cy1 = -10;
const cx2 = 30;
const cy2 = -10;
const cx3 = 0;
const cy3 = 40;

const colors = [
  { c: C.darkOrange, label: "A", lcx: cx1 - 70, lcy: cy1 - 50 },
  { c: C.steelBlue, label: "B", lcx: cx2 + 70, lcy: cy2 - 50 },
  { c: C.darkGreen, label: "C", lcx: cx3, lcy: cy3 + 70 },
];

const circles = [
  { cx: cx1, cy: cy1, col: colors[0] },
  { cx: cx2, cy: cy2, col: colors[1] },
  { cx: cx3, cy: cy3, col: colors[2] },
];

for (const c of circles) {
  new sd.Circle({
    targetNode: svg, cx: c.cx, cy: c.cy, r,
    fill: c.col.c, stroke: c.col.c, strokeWidth: 1.4,
    fillOpacity: 0.25,
  });
  new sd.Text({
    targetNode: svg, text: c.col.label,
    cx: c.col.lcx, cy: c.col.lcy, fontSize: 18, fill: c.col.c,
  });
}

sd.main(async () => {
  await sd.pause();
});

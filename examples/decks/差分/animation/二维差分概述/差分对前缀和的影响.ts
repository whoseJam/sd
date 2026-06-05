import * as sd from "@/sd";

import { Grid } from "../lib/grid";

const svg = sd.svg();
const C = sd.color();

const N = 5;
const SIZE = 48;
const GAP = 80;
const totalW = N * SIZE;

const d = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
  x: -totalW - GAP / 2,
  y: -(totalW / 2),
});
const dValues: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
const dGlyphs: sd.Text[][] = [];
for (let r = 1; r <= N; r++) {
  const row: sd.Text[] = [];
  for (let c = 1; c <= N; c++) {
    row.push(new sd.Text({
      targetNode: svg,
      text: "0",
      cx: d.cellCx(r, c),
      cy: d.cellCy(r, c),
      fontSize: 16,
      fill: C.darkButtonGrey,
    }));
  }
  dGlyphs.push(row);
}
const dLabel = new sd.Text({
  targetNode: svg,
  text: "d",
  cx: d.left() + d.width() / 2,
  cy: d.top() + 14,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

const a = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
  x: GAP / 2,
  y: -(totalW / 2),
});
const aValues: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
const aGlyphs: sd.Text[][] = [];
for (let r = 1; r <= N; r++) {
  const row: sd.Text[] = [];
  for (let c = 1; c <= N; c++) {
    row.push(new sd.Text({
      targetNode: svg,
      text: "0",
      cx: a.cellCx(r, c),
      cy: a.cellCy(r, c),
      fontSize: 16,
      fill: C.darkButtonGrey,
    }));
  }
  aGlyphs.push(row);
}
const aLabel = new sd.Text({
  targetNode: svg,
  text: "a",
  cx: a.left() + a.width() / 2,
  cy: a.top() + 14,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

void dLabel;
void aLabel;

const tweaks: Array<{ r: number; c: number; v: number }> = [
  { r: 2, c: 2, v: 1 },
  { r: 4, c: 4, v: 1 },
];

sd.main(async () => {
  await sd.pause();

  for (const { r, c, v } of tweaks) {
    dValues[r - 1][c - 1] += v;
    dGlyphs[r - 1][c - 1].startAnimate({ duration: 220 }).setText(String(dValues[r - 1][c - 1])).endAnimate();
    d.paintCell(r, c, "#fdecd9", { duration: 220, stroke: C.darkOrange });
    for (let i = r; i <= N; i++) {
      for (let j = c; j <= N; j++) {
        aValues[i - 1][j - 1] += v;
        const delay = 220 + ((i - r) + (j - c)) * 60;
        aGlyphs[i - 1][j - 1].startAnimate({ delay, duration: 200 }).setText(String(aValues[i - 1][j - 1])).endAnimate();
        a.paintCell(i, j, "#dbeefd", { delay, duration: 200, stroke: C.steelBlue });
      }
    }
    await sd.pause();
    d.paintCell(r, c, C.white, { duration: 200, stroke: C.silver });
    for (let i = r; i <= N; i++) for (let j = c; j <= N; j++) a.paintCell(i, j, C.white, { duration: 200, stroke: C.silver });
  }
  await sd.pause();
});

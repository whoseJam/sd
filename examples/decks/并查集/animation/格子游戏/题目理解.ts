import * as sd from "@/sd";

// 4x4 lattice with a handful of edges drawn between adjacent vertices —
// the player draws edges between intersections; the last edge closing
// a cycle ends the game.

const svg = sd.svg();
const C = sd.color();

const N = 4;
const SIZE = 60;
const X0 = -((N - 1) * SIZE) / 2;
const Y0 = -((N - 1) * SIZE) / 2;
const R = 8;

interface Pt { x: number; y: number }
const grid: Pt[][] = [];
for (let i = 0; i < N; i++) {
  grid.push([]);
  for (let j = 0; j < N; j++) {
    const x = X0 + j * SIZE;
    const y = Y0 + i * SIZE;
    grid[i].push({ x, y });
    new sd.Circle({
      targetNode: svg,
      cx: x,
      cy: y,
      r: R,
      fill: C.darkButtonGrey,
      stroke: C.none,
    });
  }
}

const edges: Array<[number, number, number, number]> = [
  [0, 0, 0, 1], [0, 1, 1, 1], [1, 1, 1, 2], [1, 2, 0, 2], [0, 2, 0, 1],
];

for (const [i1, j1, i2, j2] of edges) {
  new sd.Line({
    targetNode: svg,
    x1: grid[i1][j1].x,
    y1: grid[i1][j1].y,
    x2: grid[i2][j2].x,
    y2: grid[i2][j2].y,
    stroke: C.darkOrange,
    strokeWidth: 2,
  });
}

new sd.Text({ targetNode: svg, text: "成环了 ✗", cx: 0, cy: -Y0 - 30, fontSize: 14, fill: C.darkRed });

sd.main(async () => {
  await sd.pause();
});

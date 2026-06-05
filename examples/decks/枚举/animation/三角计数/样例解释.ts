import * as sd from "@/sd";

import { Grid } from "../grid";

// 5×5 lattice; place three points so a right triangle with one
// horizontal and one vertical edge appears. Beat 1 drops the points,
// beat 2 connects them.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const SIZE = 50;
const grid = new Grid({
  targetNode: svg,
  rows: 5,
  cols: 5,
  cellSize: SIZE,
});

// (col, row); row=1 top, row=5 bottom. Vertices for an axis-aligned right
// triangle.
const verts: Array<[number, number]> = [
  [1, 1],
  [1, 4],
  [3, 4],
];

const points: sd.Circle[] = [];
for (const [c, r] of verts) {
  points.push(
    new sd.Circle({
      targetNode: svg,
      cx: grid.cellCx(r, c),
      cy: grid.cellCy(r, c),
      r: 5,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

function edge(a: sd.Circle, b: sd.Circle): sd.Line {
  return new sd.Line({
    targetNode: svg,
    x1: a.attributes.cx,
    y1: a.attributes.cy,
    x2: b.attributes.cx,
    y2: b.attributes.cy,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.6,
    opacity: 0,
  });
}

const edges = [edge(points[0], points[1]), edge(points[1], points[2]), edge(points[2], points[0])];

sd.main(async () => {
  for (let i = 0; i < points.length; i++) {
    points[i]
      .startAnimate({ delay: i * 180, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (let i = 0; i < edges.length; i++) {
    edges[i]
      .startAnimate({ delay: i * 220, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});

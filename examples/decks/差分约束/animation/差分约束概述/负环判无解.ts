import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 20;

const nodes = [
  { id: 1, cx: 0, cy: 90, label: "a" },
  { id: 2, cx: 90, cy: -10, label: "b" },
  { id: 3, cx: -90, cy: -10, label: "c" },
];
const cycle: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [3, 1],
];
const weights = [2, -3, -2];
const dag = new Dag({ targetNode: svg, nodes, edges: cycle, radius: NODE_R });

const weightLabels = [
  { text: "2", cx: 64, cy: 50 },
  { text: "-3", cx: 0, cy: -34 },
  { text: "-2", cx: -64, cy: 50 },
].map(
  (w) =>
    new sd.Math({
      targetNode: svg,
      text: w.text,
      cx: w.cx,
      cy: w.cy,
      fontSize: 15,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const sumExpr = new sd.Math({
  targetNode: svg,
  text: "2 + (-3) + (-2) = -3",
  cx: 0,
  cy: -76,
  fontSize: 17,
  fill: C.darkOrange,
  opacity: 0,
});

const verdict = new sd.Math({
  targetNode: svg,
  text: "\\text{sum} < 0 \\;\\Rightarrow\\; \\text{negative cycle}",
  cx: 0,
  cy: -110,
  fontSize: 15,
  fill: C.crimson,
  opacity: 0,
});

function fadeIn(el: sd.Math, delay: number) {
  el.startAnimate({ delay, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  dag.fadeIn({ delay: 0, stagger: 60 });
  for (let i = 0; i < weightLabels.length; i++)
    fadeIn(weightLabels[i], 320 + i * 60);
  await sd.pause();

  for (let i = 0; i < cycle.length; i++) {
    const [u, v] = cycle[i];
    const w = weights[i];
    dag.paintEdge(u, v, w < 0 ? C.crimson : C.steelBlue, { delay: i * 220 });
    weightLabels[i]
      .startAnimate({ delay: i * 220, duration: 240, easing: E.easeOut })
      .setFill(w < 0 ? C.crimson : C.steelBlue)
      .endAnimate();
  }
  await sd.pause();

  fadeIn(sumExpr, 0);
  await sd.pause();

  fadeIn(verdict, 0);
  await sd.pause();
});

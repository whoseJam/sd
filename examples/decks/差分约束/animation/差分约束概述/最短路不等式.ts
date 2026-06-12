import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 22;

const nodes = [
  { id: 1, cx: -110, cy: 30, label: "i" },
  { id: 2, cx: 110, cy: 30, label: "j" },
];
const edges: Array<[number, number]> = [[1, 2]];
const dag = new Dag({ targetNode: svg, nodes, edges, radius: NODE_R });

const weight = new sd.Math({
  targetNode: svg,
  text: "k",
  cx: 0,
  cy: 50,
  fontSize: 15,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const ineq = new sd.Math({
  targetNode: svg,
  text: "x_j \\le x_i + k",
  cx: 0,
  cy: -10,
  fontSize: 17,
  fill: C.darkOrange,
  opacity: 0,
});

const relax = new sd.Math({
  targetNode: svg,
  text: "\\text{dis}_j \\le \\text{dis}_i + w(i, j)",
  cx: 0,
  cy: -42,
  fontSize: 15,
  fill: C.steelBlue,
  opacity: 0,
});

function fadeIn(el: sd.Math, delay: number) {
  el.startAnimate({ delay, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  dag.fadeIn({ delay: 0, stagger: 60 });
  fadeIn(weight, 280);
  await sd.pause();

  fadeIn(ineq, 0);
  await sd.pause();

  fadeIn(relax, 0);
  await sd.pause();

  dag.paintEdge(1, 2, C.darkOrange);
  await sd.pause();
});

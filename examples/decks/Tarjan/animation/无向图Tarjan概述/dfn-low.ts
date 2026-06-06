import * as sd from "@/sd";

import {
  DFN_COLOR,
  DFS_ORDER,
  GRAPH_NODES,
  LOW_COLOR,
  NODE_RADIUS,
  createGraph,
  fadeInClassified,
} from "../lib/graph";

const svg = sd.svg();
const E = sd.easing();

const view = createGraph(svg);

const dfnLabels = new Map<number, sd.Text>();
const lowLabels = new Map<number, sd.Text>();
for (const n of GRAPH_NODES) {
  dfnLabels.set(
    n.id,
    new sd.Text({
      targetNode: svg,
      text: "",
      cx: n.cx + NODE_RADIUS + 13,
      cy: n.cy - 9,
      fontSize: 12,
      fill: DFN_COLOR,
      opacity: 0,
    }),
  );
  lowLabels.set(
    n.id,
    new sd.Text({
      targetNode: svg,
      text: "",
      cx: n.cx + NODE_RADIUS + 13,
      cy: n.cy + 9,
      fontSize: 12,
      fill: LOW_COLOR,
      opacity: 0,
    }),
  );
}

// dfn(u) = DFS visit order. low(u) starts equal to dfn, then is pulled down
// by back edges and propagation up tree edges.
const DFN: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

sd.main(async () => {
  fadeInClassified(view);
  await sd.pause();

  // dfn appears in DFS order.
  for (let i = 0; i < DFS_ORDER.length; i++) {
    const id = DFS_ORDER[i];
    dfnLabels
      .get(id)!
      .startAnimate({ delay: i * 220, duration: 260, easing: E.easeOut })
      .setText(String(DFN[id]))
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // low initializes to dfn at every node.
  for (let i = 0; i < DFS_ORDER.length; i++) {
    const id = DFS_ORDER[i];
    lowLabels
      .get(id)!
      .startAnimate({ delay: i * 90, duration: 260, easing: E.easeOut })
      .setText(String(DFN[id]))
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // Back edge 4 → 2 pulls low[4] = dfn[2] = 2; propagation up: low[3] = 2.
  view.backDashed
    .startAnimate({ duration: 200, easing: E.easeOut })
    .setStrokeWidth(3.0)
    .endAnimate();
  lowLabels
    .get(4)!
    .startAnimate({ delay: 120, duration: 280, easing: E.easeOut })
    .setText("2")
    .endAnimate();
  view.backDashed
    .startAnimate({ delay: 420, duration: 240, easing: E.easeOut })
    .setStrokeWidth(1.6)
    .endAnimate();
  lowLabels
    .get(3)!
    .startAnimate({ delay: 720, duration: 280, easing: E.easeOut })
    .setText("2")
    .endAnimate();
  await sd.pause();
});

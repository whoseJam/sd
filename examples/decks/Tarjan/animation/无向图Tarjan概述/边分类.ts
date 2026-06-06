import * as sd from "@/sd";

import {
  BACK_COLOR,
  BACK_EDGE,
  TREE_COLOR,
  TREE_EDGES,
  createGraph,
  edgeKey,
  fadeInNeutral,
} from "../lib/graph";

const svg = sd.svg();
const E = sd.easing();

const view = createGraph(svg);

sd.main(async () => {
  fadeInNeutral(view);
  await sd.pause();

  for (let i = 0; i < TREE_EDGES.length; i++) {
    const [u, v] = TREE_EDGES[i];
    view.treeLines
      .get(edgeKey(u, v))!
      .startAnimate({ delay: i * 220, duration: 320, easing: E.easeOut })
      .setStroke(TREE_COLOR)
      .setStrokeWidth(1.8)
      .endAnimate();
  }
  await sd.pause();

  view.backLine
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  view.backDashed
    .startAnimate({ delay: 80, duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  void BACK_COLOR;
  void BACK_EDGE;
  await sd.pause();
});

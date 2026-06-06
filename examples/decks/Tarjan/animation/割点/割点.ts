import * as sd from "@/sd";

import {
  DFN_COLOR,
  GRAPH_NODES,
  LOW_COLOR,
  NODE_RADIUS,
  createGraph,
  fadeInClassified,
} from "../lib/graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const view = createGraph(svg);

// After running dfn/low we have: low pulls 3 and 4 down to 2.
const DFN: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
const LOW: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 5, 6: 6 };

const dfnTexts: sd.Text[] = [];
const lowTexts: sd.Text[] = [];
for (const n of GRAPH_NODES) {
  dfnTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(DFN[n.id]),
      cx: n.cx + NODE_RADIUS + 13,
      cy: n.cy - 9,
      fontSize: 12,
      fill: DFN_COLOR,
      opacity: 0,
    }),
  );
  lowTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(LOW[n.id]),
      cx: n.cx + NODE_RADIUS + 13,
      cy: n.cy + 9,
      fontSize: 12,
      fill: LOW_COLOR,
      opacity: 0,
    }),
  );
}

const CUT_FILL = "#fdecd9";
const CUT_STROKE = C.darkOrange;

sd.main(async () => {
  fadeInClassified(view);
  for (const t of [...dfnTexts, ...lowTexts]) {
    t.startAnimate({ delay: 500, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // 2 is a cut vertex: tree child 3 has low[3] = 2 = dfn[2].
  view.circles
    .get(2)!
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setFill(CUT_FILL)
    .setStroke(CUT_STROKE)
    .setStrokeWidth(2.2)
    .endAnimate();
  await sd.pause();

  // 5 is a cut vertex: tree child 6 has low[6] = 6 > dfn[5] = 5.
  view.circles
    .get(5)!
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setFill(CUT_FILL)
    .setStroke(CUT_STROKE)
    .setStrokeWidth(2.2)
    .endAnimate();
  await sd.pause();
});

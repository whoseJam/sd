import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const graph = new FlowGraph({
  targetNode: svg,
  nodes: [
    { id: "s", cx: -160, cy: 0, label: "s" },
    { id: "b", cx: 0, cy: 70, label: "B" },
    { id: "c", cx: 0, cy: -70, label: "C" },
    { id: "t", cx: 160, cy: 0, label: "t" },
  ],
  edges: [
    { from: "s", to: "b", cap: 1 },
    { from: "s", to: "c", cap: 1 },
    { from: "b", to: "c", cap: 1 },
    { from: "b", to: "t", cap: 1 },
    { from: "c", to: "t", cap: 1 },
  ],
  radius: 20,
});

const flowText = new sd.Text({
  targetNode: svg,
  text: "|f| = 1",
  cx: 0,
  cy: -130,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

function curvedArrow(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  curvature: number,
  color: sd.SDColor,
): { line: sd.Path; head: sd.Path } {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curvature;
  const cy = my + ny * curvature;
  const line = new sd.Path({
    targetNode: svg,
    d: `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`,
    stroke: color,
    strokeWidth: 1.8,
    fill: "none",
    opacity: 0,
    strokeDashArray: [5, 4],
  });
  const tdx = bx - cx;
  const tdy = by - cy;
  const tlen = Math.hypot(tdx, tdy) || 1;
  const ux = tdx / tlen;
  const uy = tdy / tlen;
  const px = -uy;
  const py = ux;
  const h = 7;
  const h1x = bx - ux * h + px * (h / 2);
  const h1y = by - uy * h + py * (h / 2);
  const h2x = bx - ux * h - px * (h / 2);
  const h2y = by - uy * h - py * (h / 2);
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: color,
    strokeWidth: 1,
    fill: color,
    opacity: 0,
  });
  return { line, head };
}

sd.main(async () => {
  graph.fadeIn({ delay: 0 });
  flowText
    .startAnimate({ delay: 320, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  graph.setCap("s", "b", "1/1", C.steelBlue);
  graph.setCap("b", "c", "1/1", C.steelBlue);
  graph.setCap("c", "t", "1/1", C.steelBlue);
  graph.paintEdge("s", "b", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("b", "c", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("c", "t", C.steelBlue, { strokeWidth: 1.8 });
  await sd.pause();

  const ep = graph.edgeEndpoints("b", "c");
  const reverse = curvedArrow(ep.bx, ep.by, ep.ax, ep.ay, 32, C.darkGreen);
  reverse.line
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  reverse.head
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  const reverseLabel = new sd.Text({
    targetNode: svg,
    text: "1",
    cx: -28,
    cy: 0,
    fontSize: 12,
    fill: C.darkGreen,
    opacity: 0,
  });
  reverseLabel
    .startAnimate({ delay: 120, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  graph.paintEdge("s", "c", C.darkOrange);
  reverse.line
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.darkOrange)
    .setStrokeWidth(2.4)
    .endAnimate();
  reverse.head
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.darkOrange)
    .setFill(C.darkOrange)
    .endAnimate();
  reverseLabel
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setFill(C.darkOrange)
    .endAnimate();
  graph.paintEdge("b", "t", C.darkOrange);
  await sd.pause();

  graph.setCap("s", "c", "1/1", C.steelBlue);
  graph.setCap("s", "b", "1/1", C.steelBlue);
  graph.setCap("b", "c", "0/1", C.darkButtonGrey);
  graph.setCap("c", "t", "1/1", C.steelBlue);
  graph.setCap("b", "t", "1/1", C.steelBlue);
  reverse.line
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(0.2)
    .endAnimate();
  reverse.head
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(0.2)
    .endAnimate();
  reverseLabel
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setText("0")
    .setFill(C.darkButtonGrey)
    .setOpacity(0.4)
    .endAnimate();
  graph.paintEdge("s", "b", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("s", "c", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("b", "t", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("c", "t", C.steelBlue, { strokeWidth: 1.8 });
  graph.fadeEdge("b", "c", 0.25);
  flowText
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setText("|f| = 2")
    .setFill(C.darkGreen)
    .endAnimate();
  await sd.pause();
});

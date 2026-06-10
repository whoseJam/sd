import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL_FILL = "#fdecd9";
const NEUTRAL_STROKE = C.darkOrange;
const MATCHED_FILL = C.darkOrange;
const MATCHED_TEXT = "#ffffff";
const EDGE_COLOR = "#e6c5a3";
const MATCH_COLOR = C.steelBlue;

const N = 5;
const links: [number, number][] = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 1],
  [4, 4],
  [4, 5],
  [5, 3],
  [5, 5],
];
const matching: [number, number][] = [
  [1, 2],
  [2, 1],
  [3, 4],
  [4, 5],
  [5, 3],
];

const STEP_X = 80;
const TOP_Y = 70;
const BOT_Y = -70;
const NODE_R = 16;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP_X;

function makeNode(side: "top" | "bot", i: number) {
  const cy = side === "top" ? TOP_Y : BOT_Y;
  return {
    circle: new sd.Circle({
      targetNode: svg,
      cx: cxOf(i),
      cy,
      r: NODE_R,
      fill: NEUTRAL_FILL,
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    label: new sd.Text({
      targetNode: svg,
      text: String(i),
      cx: cxOf(i),
      cy,
      fontSize: 14,
      fill: NEUTRAL_STROKE,
      opacity: 0,
    }),
  };
}

const topNodes = Array.from({ length: N + 1 }, (_, i) =>
  i === 0 ? null : makeNode("top", i),
);
const botNodes = Array.from({ length: N + 1 }, (_, i) =>
  i === 0 ? null : makeNode("bot", i),
);

const matchSet = new Set(matching.map(([a, b]) => `${a},${b}`));
const edges: { path: sd.Path; isMatch: boolean }[] = links.map(([a, b]) => ({
  path: new sd.Path({
    targetNode: svg,
    d: `M ${cxOf(a)} ${TOP_Y - NODE_R} L ${cxOf(b)} ${BOT_Y + NODE_R}`,
    stroke: matchSet.has(`${a},${b}`) ? MATCH_COLOR : EDGE_COLOR,
    strokeWidth: matchSet.has(`${a},${b}`) ? 2 : 1,
    fill: "none",
    opacity: 0,
  }),
  isMatch: matchSet.has(`${a},${b}`),
}));

const DUR = 280;
function fadeIn(el: sd.Circle | sd.Text | sd.Path, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Circle | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 1; i <= N; i++) {
    fadeIn(topNodes[i]!.circle, i * 30);
    fadeIn(topNodes[i]!.label, i * 30 + 40);
    fadeIn(botNodes[i]!.circle, i * 30 + 60);
    fadeIn(botNodes[i]!.label, i * 30 + 100);
  }
  for (let k = 0; k < edges.length; k++) {
    if (!edges[k].isMatch) fadeIn(edges[k].path, 200 + k * 30);
  }
  await sd.pause();

  for (let k = 0; k < edges.length; k++) {
    if (edges[k].isMatch) fadeIn(edges[k].path, k * 60);
  }
  for (const [a, b] of matching) {
    setFill(topNodes[a]!.circle, MATCHED_FILL, 200);
    setFill(topNodes[a]!.label, MATCHED_TEXT, 240);
    setFill(botNodes[b]!.circle, MATCHED_FILL, 200);
    setFill(botNodes[b]!.label, MATCHED_TEXT, 240);
  }
  await sd.pause();
});

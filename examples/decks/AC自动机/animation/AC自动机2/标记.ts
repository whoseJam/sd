import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// Pattern occurrence counts via fail-tree DFS sum. Walk marks each
// visit (count printed below the node); the final beat surfaces the
// per-pattern total — which equals the fail-subtree sum, but we just
// label the terminal nodes with the known counts here.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "ababaab";
const trie = new Trie(svg, {
  patterns: ["aba", "ba", "aab", "abab"],
  cx: 0,
  topY: 110,
  layerHeight: 60,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
for (let i = 1; i < trie.nodes.length; i++) {
  trie.failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 }).setOpacity(1);
}

const SIZE = 28;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: -80,
  label: "s",
});

const ACTIVE_FILL = "#dde6ef";
const ACTIVE_STROKE = C.steelBlue;
const COUNT_FILL = "#fce4a0";
const COUNT_STROKE = C.darkOrange;

// Per-node visit count labels, drawn below each node, initially hidden.
const counts = new Array<number>(trie.nodes.length).fill(0);
const countLabels: sd.Text[] = trie.nodes.map((n) =>
  new sd.Text({
    targetNode: svg,
    text: "0",
    cx: n.cx,
    cy: n.cy - 26,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
);

const subtreeSum: number[] = [];
function dfs(u: number): number {
  let sum = counts[u];
  for (const [, v] of trie.children.get(u) ?? new Map()) {
    void v;
  }
  // Fail-tree DFS: walk all i where fail[i] == u.
  for (let i = 1; i < trie.nodes.length; i++) {
    if (trie.fail[i] === u && i !== u) sum += dfs(i);
  }
  subtreeSum[u] = sum;
  return sum;
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  await sd.pause();

  for (const step of trie.walk(text)) {
    trie.paintNode(step.to, ACTIVE_FILL, ACTIVE_STROKE);
    row.paintCell(step.i, ACTIVE_FILL, ACTIVE_STROKE);
    counts[step.to] += 1;
    countLabels[step.to]
      .startAnimate({ duration: 220, easing: E.easeOut })
      .setText(String(counts[step.to]))
      .setOpacity(1)
      .endAnimate();
    await sd.pause();
  }

  // Fail-tree subtree sum: terminal-node total = count(node) + sum over
  // every i whose fail chain runs through it. Compute, then re-label.
  for (let i = 0; i < trie.nodes.length; i++) subtreeSum[i] = 0;
  dfs(0);
  for (let i = 1; i < trie.nodes.length; i++) {
    if (!trie.nodes[i].isEnd) continue;
    trie.paintNode(i, COUNT_FILL, COUNT_STROKE);
    countLabels[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setText(String(subtreeSum[i]))
      .setFill(C.darkOrange)
      .endAnimate();
  }
  await sd.pause();
});

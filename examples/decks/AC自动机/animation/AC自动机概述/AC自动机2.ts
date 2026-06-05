import * as sd from "@/sd";

import { Trie } from "../trie";

// Bigger trie of {abab, babb}; fail links appear one at a time, BFS
// order, with the under-construction node highlighted in orange and its
// new fail target highlighted in blue.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const trie = new Trie(svg, { patterns: ["abab", "babb"], cx: 0, topY: 0 });
trie.buildFail();

const FAIL_INK = "#c08fbf";
const CONSTRUCT_FILL = "#fce4a0";
const CONSTRUCT_STROKE = C.darkOrange;
const TARGET_FILL = "#dde6ef";
const TARGET_STROKE = C.steelBlue;
const NEUTRAL_FILL = C.white;
const NEUTRAL_STROKE = C.darkButtonGrey;

interface Step {
  v: number;
  f: number;
}
const steps: Step[] = [];
const queue: number[] = [];
const rootChildren = trie.children.get(0);
if (rootChildren) for (const c of rootChildren.values()) queue.push(c);
while (queue.length > 0) {
  const u = queue.shift() as number;
  const uChildren = trie.children.get(u);
  if (!uChildren) continue;
  for (const v of uChildren.values()) {
    steps.push({ v, f: trie.fail[v] });
    queue.push(v);
  }
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();

  // Don't clear between steps: same node may show up as both a previous
  // step's "construction" and the next step's "target", and re-painting
  // the same fill within one beat throws an action conflict. Letting
  // the colors accumulate also reads fine — viewers see all nodes that
  // have been touched up to the current step.
  for (const { v, f } of steps) {
    trie.paintNode(v, CONSTRUCT_FILL, CONSTRUCT_STROKE);
    trie.paintNode(f, TARGET_FILL, TARGET_STROKE);
    const link = trie.failLink(v, f, { stroke: FAIL_INK, bending: 0.3 });
    link
      .startAnimate({ delay: 180, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    await sd.pause();
  }
  await sd.pause();
});

void NEUTRAL_FILL;
void NEUTRAL_STROKE;

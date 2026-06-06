import * as sd from "@/sd";

import { Trie } from "../trie";

// Same trie graph, two ways to walk it. Matching: given input, you
// trace a path. Construction: you traverse a path → the path itself
// is the string you're producing. The image is one trie with two
// coloured walks superimposed.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const trie = new Trie(svg, {
  patterns: ["01", "11", "000"],
  cx: 0,
  topY: 0,
  layerHeight: 60,
  nodeRadius: 14,
});
trie.buildFail();

for (let i = 1; i < trie.nodes.length; i++) {
  trie
    .failLink(i, trie.fail[i], { stroke: "#c08fbf", bending: 0.3 })
    .setOpacity(1);
}
for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd)
    trie.nodes[i].circle.setStroke(C.darkGreen).setStrokeWidth(2.2);
}

const MATCH_FILL = "#dde6ef";
const MATCH_STROKE = C.steelBlue;
const BUILD_FILL = "#fce4a0";
const BUILD_STROKE = C.darkOrange;

const matchPath = trie.walk("001").map((s) => s.to);

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();

  for (let k = 0; k < matchPath.length; k++) {
    trie.paintNode(matchPath[k], MATCH_FILL, MATCH_STROKE, { delay: k * 160 });
  }
  await sd.pause();

  // Construction: walk a hand-picked safe path (no terminal visited).
  // Pick a chain by descending children avoiding terminal nodes.
  const constructPath: number[] = [];
  let cur = 0;
  for (let step = 0; step < 4; step++) {
    const children = trie.children.get(cur);
    if (!children) break;
    let next: number | undefined;
    for (const [, v] of children) {
      if (!trie.nodes[v].isEnd) {
        next = v;
        break;
      }
    }
    if (next === undefined) break;
    constructPath.push(next);
    cur = next;
  }
  for (let k = 0; k < constructPath.length; k++) {
    trie.paintNode(constructPath[k], BUILD_FILL, BUILD_STROKE, {
      delay: k * 160,
    });
  }
  await sd.pause();

  void E;
});

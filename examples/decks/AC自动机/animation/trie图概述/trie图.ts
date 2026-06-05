import * as sd from "@/sd";

import { Trie } from "../trie";

// Full trie graph: every (node, char) pair has a transition. Solid trie
// edges + dashed fail edges + curved teal "implied" transitions for
// the cases where the fail walk would resolve. Cleaner than the AC
// view because matching no longer hops via fail.

const svg = sd.svg();
const C = sd.color();

const trie = new Trie(svg, {
  patterns: ["abab", "babb"],
  cx: 0,
  topY: 0,
  layerHeight: 70,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
for (let i = 1; i < trie.nodes.length; i++) {
  trie.failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 }).setOpacity(1);
}

const go = trie.trieGraph(["a", "b"]);
const GRAPH_INK = "#3da99c";
const extraPaths: sd.Path[] = [];
for (const [u, uGo] of go) {
  for (const [, v] of uGo) {
    if (u === v) continue;
    if (v === 0) continue;
    const direct = [...(trie.children.get(u)?.values() ?? [])].includes(v);
    if (direct) continue;
    extraPaths.push(trie.failLink(u, v, { stroke: GRAPH_INK, bending: 0.45 }));
  }
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 0; i < extraPaths.length; i++) {
    extraPaths[i]
      .startAnimate({ delay: i * 60, duration: 280 })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
  void C;
});

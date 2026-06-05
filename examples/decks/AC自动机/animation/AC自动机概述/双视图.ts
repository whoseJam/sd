import * as sd from "@/sd";

import { Trie } from "../trie";

// trie {ababa, babb} with fail links, plus one "two-view" walk: a path
// down the trie (extension) followed by a chain up the fail tree (suffix
// shaving). Picks node 7 = "ababa" then walks 7 → fail[7] → ... → root.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const trie = new Trie(svg, { patterns: ["ababa", "babb"], cx: 0, topY: 0 });
trie.buildFail();

const TRIE_INK = C.steelBlue;
const FAIL_INK = "#c08fbf";
const DOWN_FILL = "#dde6ef";
const UP_FILL = "#f0d5ee";

// Static fail links.
const failPaths: sd.Path[] = [];
for (let i = 1; i < trie.nodes.length; i++) {
  const f = trie.fail[i];
  if (f === i) continue;
  failPaths.push(trie.failLink(i, f, { stroke: FAIL_INK, bending: 0.3 }));
}

// Find the "ababa" terminal node (deepest node along trie["ababa"]).
function locate(pattern: string): number {
  let cur = 0;
  for (const ch of pattern) {
    const next = trie.children.get(cur)?.get(ch);
    if (next === undefined) return cur;
    cur = next;
  }
  return cur;
}

const target = locate("ababa");

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  for (let i = 0; i < failPaths.length; i++) {
    failPaths[i]
      .startAnimate({ delay: 600 + i * 80, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // View 1: walk down the trie root → target.
  const downChain = trie.pathToRoot(target).reverse();
  for (let k = 0; k < downChain.length; k++) {
    trie.paintNode(downChain[k], DOWN_FILL, TRIE_INK, { delay: k * 160 });
  }
  await sd.pause();

  // View 2: climb fail links from target up to root.
  let cur = target;
  let step = 0;
  while (cur !== 0) {
    const next = trie.fail[cur];
    trie.paintNode(next, UP_FILL, "#9a4c97", { delay: step * 220 });
    step++;
    cur = next;
  }
  await sd.pause();
});

void E;

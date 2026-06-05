import * as sd from "@/sd";

import { Trie } from "../trie";

// trie of {aba, bab} with the fail-link skeleton drawn on top. Two
// beats: trie appears, then fail links (curved dashed) animate in.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const trie = new Trie(svg, { patterns: ["aba", "bab"], cx: 0, topY: 0 });
trie.buildFail();

const FAIL_INK = "#c08fbf";
const failPaths: sd.Path[] = [];
for (let i = 1; i < trie.nodes.length; i++) {
  const f = trie.fail[i];
  if (f === i) continue;
  failPaths.push(trie.failLink(i, f, { stroke: FAIL_INK, bending: 0.3 }));
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 0; i < failPaths.length; i++) {
    failPaths[i]
      .startAnimate({ delay: i * 120, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});

void C;

import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// AC walk of "abaabba" on trie {aba, ba, aa, bb}. Trie on top, string
// underneath; at each step the current AC node lights up blue and the
// matched character in the text turns blue too.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "abaabba";
const trie = new Trie(svg, {
  patterns: ["aba", "ba", "aa", "bb"],
  cx: 0,
  topY: 110,
  layerHeight: 50,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
const failPaths: sd.Path[] = [];
for (let i = 1; i < trie.nodes.length; i++) {
  failPaths.push(trie.failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 }));
}

const SIZE = 26;
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

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  for (let i = 0; i < failPaths.length; i++) {
    failPaths[i]
      .startAnimate({ delay: 600 + i * 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  const steps = trie.walk(text);
  for (const step of steps) {
    trie.paintNode(step.to, ACTIVE_FILL, ACTIVE_STROKE);
    row.paintCell(step.i, ACTIVE_FILL, ACTIVE_STROKE);
    await sd.pause();
  }
});

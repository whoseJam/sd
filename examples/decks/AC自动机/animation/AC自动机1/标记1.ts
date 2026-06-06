import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// Terminal-only marking: at each step paint the destination green ONLY
// if it terminates a pattern. With patterns {aba, ba, aa, bb, b} and
// text "abaa", "ba" and "b" appear in the string but are missed —
// they're suffixes of patterns we passed through without landing on.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "abaa";
const trie = new Trie(svg, {
  patterns: ["aba", "ba", "aa", "bb", "b"],
  cx: 0,
  topY: 110,
  layerHeight: 50,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
for (let i = 1; i < trie.nodes.length; i++) {
  trie
    .failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 })
    .setOpacity(1);
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

// Highlight terminal nodes' borders so the viewer reads which ones
// represent patterns.
const TERMINAL_STROKE = C.darkGreen;
for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd)
    trie.nodes[i].circle.setStroke(TERMINAL_STROKE).setStrokeWidth(2.2);
}

const MARK_FILL = "#cfead0";
const MARK_STROKE = C.darkGreen;

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  await sd.pause();

  for (const step of trie.walk(text)) {
    row.paintCell(step.i, MARK_FILL, MARK_STROKE);
    if (trie.nodes[step.to].isEnd) {
      trie.paintNode(step.to, MARK_FILL, MARK_STROKE);
    }
    await sd.pause();
  }

  void E;
});

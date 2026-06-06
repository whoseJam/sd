import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// Walk an input sequence on the trie graph. Whenever the walk lands on
// a terminal node, that means we just matched a forbidden word — flag
// it. With patterns {abab, babb} and input "ababbab" we should see
// matches as we walk.

const svg = sd.svg();
const C = sd.color();

const text = "ababbab";
const trie = new Trie(svg, {
  patterns: ["abab", "babb"],
  cx: 0,
  topY: 130,
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

const SIZE = 28;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: -90,
  label: "s",
});

const ACTIVE_FILL = "#dde6ef";
const ACTIVE_STROKE = C.steelBlue;
const HIT_FILL = "#cfead0";
const HIT_STROKE = C.darkGreen;

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  await sd.pause();

  for (const step of trie.walk(text)) {
    const isMatch = trie.nodes[step.to].isEnd;
    trie.paintNode(
      step.to,
      isMatch ? HIT_FILL : ACTIVE_FILL,
      isMatch ? HIT_STROKE : ACTIVE_STROKE,
    );
    row.paintCell(
      step.i,
      isMatch ? HIT_FILL : ACTIVE_FILL,
      isMatch ? HIT_STROKE : ACTIVE_STROKE,
    );
    await sd.pause();
  }
});

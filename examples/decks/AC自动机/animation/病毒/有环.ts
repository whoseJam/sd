import * as sd from "@/sd";

import { Trie } from "../trie";

// {011, 11, 000}: trie graph has a safe cycle "0" ↔ "01". Pattern of
// "010101…" never lands on a terminal. Anim paints terminals red,
// then highlights the two non-terminal cycle nodes green.

const svg = sd.svg();
const C = sd.color();

const trie = new Trie(svg, {
  patterns: ["011", "11", "000"],
  cx: 0,
  topY: 0,
  layerHeight: 55,
  nodeRadius: 14,
});
trie.buildFail();

for (let i = 1; i < trie.nodes.length; i++) {
  trie
    .failLink(i, trie.fail[i], { stroke: "#c08fbf", bending: 0.3 })
    .setOpacity(1);
}

const SAFE_FILL = "#cfead0";
const SAFE_STROKE = C.darkGreen;
const TERM_FILL = "#f4cfcf";
const TERM_STROKE = C.darkRed;

const nodeOf = (prefix: string) =>
  trie.nodes.findIndex((n) => n.prefix === prefix);

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();

  for (let i = 1; i < trie.nodes.length; i++) {
    if (trie.nodes[i].isEnd) trie.paintNode(i, TERM_FILL, TERM_STROKE);
  }
  await sd.pause();

  const a = nodeOf("0");
  const b = nodeOf("01");
  if (a > 0 && b > 0) {
    trie.paintNode(a, SAFE_FILL, SAFE_STROKE);
    trie.paintNode(b, SAFE_FILL, SAFE_STROKE, { delay: 200 });
  }
  await sd.pause();
});

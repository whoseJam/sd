import * as sd from "@/sd";

import { Trie } from "../trie";

// {01, 11, 000}: every non-terminal node's transitions eventually hit
// a terminal (no safe infinite cycle exists). Static — terminals turn
// red on the second beat so the dead-end structure reads at a glance.

const svg = sd.svg();
const C = sd.color();

const trie = new Trie(svg, {
  patterns: ["01", "11", "000"],
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

const TERM_FILL = "#f4cfcf";
const TERM_STROKE = C.darkRed;

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();

  for (let i = 1; i < trie.nodes.length; i++) {
    if (trie.nodes[i].isEnd) trie.paintNode(i, TERM_FILL, TERM_STROKE);
  }
  await sd.pause();
});

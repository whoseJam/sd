import * as sd from "@/sd";

import { Trie } from "../../../AC自动机/animation/trie";

const svg = sd.svg();
const C = sd.color();

const dict = ["aaaba", "aa", "aaabb", "abaab", "aba", "ababb", "abbab"];
const trie = new Trie(svg, {
  patterns: dict,
  cx: 0,
  topY: 0,
  layerHeight: 50,
  nodeRadius: 13,
});

for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd) trie.nodes[i].circle.setStroke(C.darkRed).setStrokeWidth(2.4);
}

sd.main(async () => {
  trie.fadeIn({ delay: 0, stagger: 50, duration: 240 });
  await sd.pause();
});

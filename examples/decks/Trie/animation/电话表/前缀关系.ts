import * as sd from "@/sd";

import { Trie } from "../lib/trie";

// Phone numbers: ["2354", "2364", "23", "1454"]. "23" is a proper
// prefix of "2354" — the trie terminal for "23" sits along the path
// to "2354"'s terminal. That's the bug the slide warns about.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const numbers = ["2354", "2364", "23", "1454"];
const trie = new Trie(svg, {
  patterns: numbers,
  cx: 80,
  topY: 0,
  layerHeight: 60,
  nodeRadius: 18,
});

for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd)
    trie.nodes[i].circle.setStroke(C.darkRed).setStrokeWidth(2.4);
}

const listLabels: sd.Text[] = [];
for (let i = 0; i < numbers.length; i++) {
  listLabels.push(
    new sd.Text({
      targetNode: svg,
      text: numbers[i],
      cx: -160,
      cy: -i * 30,
      fontSize: 20,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  for (let i = 0; i < listLabels.length; i++) {
    listLabels[i]
      .startAnimate({ delay: 80 + i * 80, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});

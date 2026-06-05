import * as sd from "@/sd";

import { Trie } from "../lib/trie";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const usernames = ["hello", "hi", "hella", "hill"];

const trie = new Trie(svg, {
  patterns: usernames,
  cx: 80,
  topY: 0,
  layerHeight: 60,
  nodeRadius: 16,
});

for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd) {
    trie.nodes[i].circle.setStroke(C.darkRed).setStrokeWidth(2.4);
  }
}

const listLabels: sd.Text[] = [];
for (let i = 0; i < usernames.length; i++) {
  listLabels.push(
    new sd.Text({
      targetNode: svg,
      text: usernames[i],
      cx: -160,
      cy: -i * 28,
      fontSize: 18,
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

import * as sd from "@/sd";

import { Trie } from "../lib/trie";

// 01-trie of integers [0, 2, 6, 7] encoded as 3-bit MSB-first strings.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BITS = 3;
const values = [0, 2, 6, 7];

const toBits = (v: number) => {
  let s = "";
  for (let i = BITS - 1; i >= 0; i--) s += String((v >> i) & 1);
  return s;
};

const patterns = values.map(toBits);
const trie = new Trie(svg, {
  patterns,
  cx: 100,
  topY: 0,
  layerHeight: 70,
  nodeRadius: 16,
  siblingGap: 90,
});

for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd)
    trie.nodes[i].circle.setStroke(C.darkRed).setStrokeWidth(2.4);
}

const listLabels: sd.Text[] = [];
for (let i = 0; i < values.length; i++) {
  listLabels.push(
    new sd.Text({
      targetNode: svg,
      text: `${values[i]}  :  ${patterns[i]}`,
      cx: -160,
      cy: 30 - i * 32,
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

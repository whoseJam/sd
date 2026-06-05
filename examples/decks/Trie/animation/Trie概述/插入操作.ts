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

const root = 0;
trie.nodes[root].circle.setOpacity(1);
trie.nodes[root].charText.setOpacity(1);

// Per-pattern node groups: walk the prefix in trie; nodes whose path-
// prefix starts at or after the first new node are the freshly added
// ones for that pattern.
const groups: number[][] = [];
const seen = new Set<number>([root]);
for (const pattern of usernames) {
  const group: number[] = [];
  let cur = root;
  for (const ch of pattern) {
    const next = trie.children.get(cur)?.get(ch);
    if (next === undefined) break;
    if (!seen.has(next)) {
      seen.add(next);
      group.push(next);
    }
    cur = next;
  }
  groups.push(group);
}

const patternLabel = new sd.Text({
  targetNode: svg,
  text: "",
  cx: -120,
  cy: 30,
  fontSize: 22,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const TERMINAL_STROKE = C.darkRed;

sd.main(async () => {
  await sd.pause();
  for (let p = 0; p < groups.length; p++) {
    patternLabel
      .startAnimate({ duration: 220, easing: E.easeOut })
      .setText(usernames[p])
      .setOpacity(1)
      .endAnimate();
    trie.fadeInNodes(groups[p], { delay: 100, stagger: 140, duration: 280 });
    // After the last node of this pattern lights up, paint the terminal.
    const terminalId = (() => {
      let cur = root;
      for (const ch of usernames[p]) {
        cur = trie.children.get(cur)?.get(ch) ?? cur;
      }
      return cur;
    })();
    trie.paintNode(terminalId, C.white, TERMINAL_STROKE, {
      delay: 100 + groups[p].length * 140,
      duration: 260,
      strokeWidth: 2.4,
    });
    await sd.pause();
  }
});

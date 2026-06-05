import * as sd from "@/sd";

import { Trie } from "../../../AC自动机/animation/trie";

// Greedy max-XOR query for value 6 (110) against the trie of {0, 2, 6, 7}.
// At each bit pick the opposite child if it exists. Path shown in green.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BITS = 3;
const values = [0, 2, 6, 7];
const QUERY = 6;

const toBits = (v: number) => {
  let s = "";
  for (let i = BITS - 1; i >= 0; i--) s += String((v >> i) & 1);
  return s;
};

const patterns = values.map(toBits);
const trie = new Trie(svg, {
  patterns,
  cx: 0,
  topY: 0,
  layerHeight: 60,
  nodeRadius: 16,
  siblingGap: 90,
});
for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd) trie.nodes[i].circle.setStroke(C.darkRed).setStrokeWidth(2.4);
}

const queryBits = toBits(QUERY);
const queryLabel = new sd.Text({
  targetNode: svg,
  text: `query = ${QUERY} (${queryBits})`,
  cx: 0,
  cy: 50,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const PICK_FILL = "#cfead0";
const PICK_STROKE = C.darkGreen;
const FALLBACK_FILL = "#fce4a0";
const FALLBACK_STROKE = C.darkOrange;

// Greedy walk from root.
interface GreedyStep { node: number; preferred: string; got: string; }
const steps: GreedyStep[] = [];
{
  let cur = 0;
  for (let i = BITS - 1; i >= 0; i--) {
    const want = String(1 - ((QUERY >> i) & 1));
    const other = String((QUERY >> i) & 1);
    const c = trie.children.get(cur);
    const next = c?.get(want) ?? c?.get(other);
    if (next === undefined) break;
    steps.push({ node: next, preferred: want, got: c?.get(want) !== undefined ? want : other });
    cur = next;
  }
}

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  queryLabel.startAnimate({ delay: 500, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  for (let k = 0; k < steps.length; k++) {
    const step = steps[k];
    const hit = step.got === step.preferred;
    trie.paintNode(step.node, hit ? PICK_FILL : FALLBACK_FILL, hit ? PICK_STROKE : FALLBACK_STROKE, {
      delay: k * 200,
    });
  }
  await sd.pause();
});

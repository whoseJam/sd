import * as sd from "@/sd";

import { addPath, makeTrieViz, valueBits } from "../common/persistent-trie";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BITS = 4;
const VALUES = [5, 2, 11, 6, 13];
const QUERY = 9;

const layout = {
  rootCx: 0,
  rootCy: 110,
  layerH: 50,
  leafSpan: 380,
  bits: BITS,
  nodeR: 10,
};

const trie = makeTrieViz({ targetNode: svg, layout });
for (const v of VALUES) addPath(trie, v);

// Greedy walk that prefers the opposite bit of QUERY when available.
const queryBits = valueBits(QUERY, BITS);

function walk(): string[] {
  const visited: string[] = [""];
  let cur = "";
  for (let i = 0; i < BITS; i++) {
    const wanted = queryBits[i] === "0" ? "1" : "0";
    const wantedNext = cur + wanted;
    const fallbackNext = cur + queryBits[i];
    if (trie.nodes.has(wantedNext)) cur = wantedNext;
    else if (trie.nodes.has(fallbackNext)) cur = fallbackNext;
    else break;
    visited.push(cur);
  }
  return visited;
}

const walkPath = walk();

const focus = new sd.Circle({
  targetNode: svg,
  cx: -1000,
  cy: -1000,
  r: layout.nodeR + 4,
  fill: C.transparent,
  stroke: C.steelBlue,
  strokeWidth: 1.8,
  opacity: 0,
});

sd.main(async () => {
  let i = 0;
  for (const node of trie.nodes.values()) {
    const d = node.depth * 90 + i * 12;
    node.circle
      .startAnimate({ delay: d, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    if (node.edge) {
      node.edge
        .startAnimate({ delay: d + 30, duration: 240, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    i++;
  }
  await sd.pause();

  for (let i = 1; i < walkPath.length; i++) {
    const prefix = walkPath[i];
    const node = trie.nodes.get(prefix)!;
    focus
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setCx(node.cx)
      .setCy(node.cy)
      .setOpacity(1)
      .endAnimate();
    if (node.edge) {
      node.edge
        .startAnimate({ duration: 240, easing: E.easeOut })
        .setStroke(C.steelBlue)
        .setStrokeWidth(1.6)
        .endAnimate();
    }
    node.circle
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
    await sd.pause();
  }
});

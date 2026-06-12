import * as sd from "@/sd";

import { addPath, makeTrieViz, pathPrefixes } from "../common/persistent-trie";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BITS = 3;
const VALUES = [5, 2, 6];
const COLUMN_GAP = 260;
const ROOT_Y = 90;

function siblingOf(prefix: string): string {
  if (!prefix) return "";
  return prefix.slice(0, -1) + (prefix.slice(-1) === "0" ? "1" : "0");
}

const layouts = VALUES.map((_, i) => ({
  rootCx: -((VALUES.length - 1) * COLUMN_GAP) / 2 + i * COLUMN_GAP,
  rootCy: ROOT_Y,
  layerH: 50,
  leafSpan: 160,
  bits: BITS,
  nodeR: 10,
}));

const tries = layouts.map((layout) => makeTrieViz({ targetNode: svg, layout }));

for (let v = 0; v < VALUES.length; v++) {
  addPath(tries[v], VALUES[v]);
}

interface Borrow {
  line: sd.Line;
}
const borrows: Borrow[][] = [];
for (let v = 0; v < VALUES.length; v++) {
  const links: Borrow[] = [];
  if (v > 0) {
    const prefixes = pathPrefixes(VALUES[v], BITS);
    for (let d = 1; d <= BITS; d++) {
      const parentPrefix = prefixes[d - 1];
      const sibPrefix = siblingOf(prefixes[d]);
      let target;
      for (let w = v - 1; w >= 0; w--) {
        const node = tries[w].nodes.get(sibPrefix);
        if (node) {
          target = node;
          break;
        }
      }
      if (!target) continue;
      const parent = tries[v].nodes.get(parentPrefix)!;
      const line = new sd.Line({
        targetNode: svg,
        x1: parent.cx,
        y1: parent.cy - layouts[v].nodeR,
        x2: target.cx,
        y2: target.cy + layouts[v].nodeR,
        stroke: C.textBlue,
        strokeWidth: 0.9,
        strokeDashArray: [3, 3],
        opacity: 0,
      });
      links.push({ line });
    }
  }
  borrows.push(links);
}

async function fadeInTrie(v: number, baseDelay = 0) {
  const viz = tries[v];
  let i = 0;
  for (const node of viz.nodes.values()) {
    const d = baseDelay + node.depth * 100 + i * 12;
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
  for (const { line } of borrows[v]) {
    line
      .startAnimate({
        delay: baseDelay + 220,
        duration: 320,
        easing: E.easeOut,
      })
      .setOpacity(1)
      .endAnimate();
  }
}

sd.main(async () => {
  for (let v = 0; v < VALUES.length; v++) {
    fadeInTrie(v);
    await sd.pause();
  }
});

import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 100 },
  { id: 2, cx: 0, cy: 40 },
  { id: 3, cx: 0, cy: -20 },
  { id: 4, cx: 0, cy: -80 },
];

const parent: Record<number, number> = { 2: 1, 3: 2, 4: 3 };

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const tones: Array<{ tone: string; color: sd.SDColor }> = [
  { tone: "#e8f5e9", color: C.darkGreen },
  { tone: "#fdecd9", color: C.darkOrange },
  { tone: "#dbeefd", color: C.steelBlue },
  { tone: "#ead4fb", color: "#7c4dff" as sd.SDColor },
];

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  for (let k = 0; k <= 3; k++) {
    const id = 4 - k;
    const { tone, color } = tones[k];
    tree.paint(id, tone as sd.SDColor, color);
    tree.setTag(id, `${k} 级祖先`, color);
    await sd.pause();
  }
});

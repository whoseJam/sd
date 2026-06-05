import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";
import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const prufer = [4, 5, 4, 5];

const seqRow = new NumRow({
  targetNode: svg,
  values: prufer,
  size: 40,
  x: -(prufer.length * 40) / 2,
  y: 100,
  label: "prufer",
  labelGap: 40,
});

const nodes = [
  { id: 1, cx: -180, cy: 0 },
  { id: 2, cx: 60, cy: 60 },
  { id: 3, cx: -180, cy: -80 },
  { id: 4, cx: -60, cy: -40 },
  { id: 5, cx: 60, cy: -60 },
  { id: 6, cx: 180, cy: -100 },
];

const parent: Record<number, number> = {
  1: 4, 3: 4, 4: 5, 2: 5, 6: 5,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 5, radius: 18 });

sd.main(async () => {
  seqRow.fadeIn({ delay: 0 });
  await sd.pause();
  tree.fadeIn({ delay: 0 });
  for (let i = 0; i < prufer.length; i++) {
    seqRow.paintCell(i + 1, "#fdecd9", C.darkOrange, { delay: i * 200, duration: 200 });
  }
  await sd.pause();
});

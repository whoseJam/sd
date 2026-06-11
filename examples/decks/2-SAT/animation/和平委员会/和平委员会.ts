import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();
const C = sd.color();

const COL_X = 140;
const ROW_GAP = 80;

const labels = ["A_1", "A_2", "B_1", "B_2", "C_1", "C_2", "D_1", "D_2"];
const nodes = labels.map((label, i) => {
  const party = Math.floor(i / 2);
  const cy = (1.5 - party) * ROW_GAP;
  const cx = i % 2 === 0 ? -COL_X : COL_X;
  return { id: i + 1, cx, cy, label };
});

const another = (x: number) => (x % 2 === 1 ? x + 1 : x - 1);
const hatreds: Array<[number, number]> = [
  [1, 4],
  [3, 5],
  [1, 6],
  [4, 2],
];
const edgeSet = new Set<string>();
const edges: Array<[number, number]> = [];
for (const [a, b] of hatreds) {
  const e1: [number, number] = [a, another(b)];
  const e2: [number, number] = [b, another(a)];
  for (const e of [e1, e2]) {
    const k = `${e[0]}-${e[1]}`;
    if (!edgeSet.has(k)) {
      edgeSet.add(k);
      edges.push(e);
    }
  }
}

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
  mathLabel: true,
  fontSize: 14,
});

const sccStroke: Record<number, sd.SDColor> = {
  1: C.steelBlue as sd.SDColor,
  4: C.steelBlue as sd.SDColor,
  5: C.steelBlue as sd.SDColor,
  2: C.darkOrange as sd.SDColor,
  3: C.darkOrange as sd.SDColor,
  6: C.darkOrange as sd.SDColor,
  7: C.darkButtonGrey as sd.SDColor,
  8: C.darkButtonGrey as sd.SDColor,
};
const sccFill: Record<number, string> = {
  1: "#e2ecf6",
  4: "#e2ecf6",
  5: "#e2ecf6",
  2: "#fdecd9",
  3: "#fdecd9",
  6: "#fdecd9",
  7: "#eeeeee",
  8: "#eeeeee",
};

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
  let d = 0;
  for (const id of Object.keys(sccStroke).map(Number)) {
    dag.paint(id, sccFill[id] as sd.SDColor, sccStroke[id], {
      delay: d,
      labelFill: sccStroke[id],
    });
    d += 80;
  }
  await sd.pause();
});

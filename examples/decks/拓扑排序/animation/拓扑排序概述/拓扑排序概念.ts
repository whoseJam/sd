import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -200, cy: 80 },
  { id: 2, cx: -80, cy: 80 },
  { id: 3, cx: 60, cy: 80 },
  { id: 4, cx: -140, cy: -10 },
  { id: 5, cx: -20, cy: -10 },
  { id: 6, cx: 120, cy: -10 },
];

const edges: Array<[number, number]> = [
  [1, 4], [2, 4], [2, 5], [3, 5], [3, 6], [4, 5], [5, 6],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 18,
});

// One valid topo order: 1, 2, 3, 4, 5, 6.
const order = [1, 2, 3, 4, 5, 6];
const seqY = -120;
const SIZE = 38;

const seqGroup = new sd.Group({ targetNode: svg });

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  const X0 = -(order.length * SIZE) / 2;
  for (let i = 0; i < order.length; i++) {
    const id = order[i];
    const cx = X0 + (i + 0.5) * SIZE;
    const r = new sd.Rect({
      targetNode: seqGroup,
      x: X0 + i * SIZE, y: seqY - SIZE / 2,
      width: SIZE, height: SIZE,
      fill: "#fdecd9", stroke: C.darkOrange, strokeWidth: 1.4, opacity: 0,
    });
    const t = new sd.Text({
      targetNode: seqGroup, text: String(id),
      cx, cy: seqY, fontSize: 14, fill: C.darkButtonGrey, opacity: 0,
    });
    const E = sd.easing();
    r.startAnimate({ delay: i * 220, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
    t.startAnimate({ delay: i * 220 + 80, duration: 200, easing: E.easeOut }).setOpacity(1).endAnimate();
    dag.paint(id, "#fdecd9", C.darkOrange, { delay: i * 220 });
    await sd.pause();
  }
});

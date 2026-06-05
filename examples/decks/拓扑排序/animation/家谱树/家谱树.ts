import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -120, cy: 80 },
  { id: 2, cx: 0, cy: 80 },
  { id: 3, cx: 120, cy: 80 },
  { id: 4, cx: -180, cy: 0 },
  { id: 5, cx: -60, cy: 0 },
  { id: 6, cx: 60, cy: 0 },
  { id: 7, cx: 180, cy: 0 },
];

const edges: Array<[number, number]> = [
  [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 18,
});

const SIZE = 36;
const order = [1, 2, 3, 4, 5, 6, 7];

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  const X0 = -(order.length * SIZE) / 2;
  const Y = -100;
  for (let i = 0; i < order.length; i++) {
    const id = order[i];
    const r = new sd.Rect({
      targetNode: svg,
      x: X0 + i * SIZE, y: Y - SIZE / 2,
      width: SIZE, height: SIZE,
      fill: "#fdecd9", stroke: C.darkOrange, strokeWidth: 1.4, opacity: 0,
    });
    const t = new sd.Text({
      targetNode: svg, text: String(id),
      cx: X0 + (i + 0.5) * SIZE, cy: Y,
      fontSize: 14, fill: C.darkButtonGrey, opacity: 0,
    });
    const E = sd.easing();
    r.startAnimate({ delay: i * 200, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
    t.startAnimate({ delay: i * 200 + 60, duration: 200, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  await sd.pause();
});

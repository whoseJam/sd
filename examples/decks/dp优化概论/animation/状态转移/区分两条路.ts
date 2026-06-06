import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const items = [
  {
    text: "减少转移数量",
    cx: -160,
    color: C.steelBlue,
    tone: "#dbeefd" as sd.SDColor,
  },
  {
    text: "加速转移过程",
    cx: 160,
    color: C.darkOrange,
    tone: "#fdecd9" as sd.SDColor,
  },
];

for (let i = 0; i < items.length; i++) {
  const it = items[i];
  const r = new sd.Rect({
    targetNode: svg,
    x: it.cx - 90,
    y: -30,
    width: 180,
    height: 60,
    fill: it.tone,
    stroke: it.color,
    strokeWidth: 1.8,
    opacity: 0,
  });
  r.startAnimate({ delay: i * 200, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  new sd.Text({
    targetNode: svg,
    text: it.text,
    cx: it.cx,
    cy: 0,
    fontSize: 16,
    fill: it.color,
    opacity: 0,
  })
    .startAnimate({ delay: i * 200 + 100, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  await sd.pause();
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

new sd.Math({
  targetNode: svg,
  text: "(\\text{block}(l), \\text{block}(r), t)",
  cx: 0, cy: 0,
  fontSize: 18, fill: C.darkButtonGrey,
});

new sd.Text({
  targetNode: svg,
  text: "三关键字排序：左块 → 右块 → 时间",
  cx: 0, cy: -30, fontSize: 12, fill: C.darkOrange,
});

sd.main(async () => {
  await sd.pause();
});

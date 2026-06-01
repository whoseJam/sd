import * as sd from "@/sd";

import { playPart1 } from "./part1_branches";
import { playPart2 } from "./part2_version1";
import { playPart3 } from "./part3_version2";
import { playPart4 } from "./part4_simplify";

sd.main(async () => {
  const svg = sd.svg();

  // 背景
  const bg = new sd.Rect({
    targetNode: svg,
    x: 0,
    y: 0,
    width: 1200,
    height: 600,
    fill: "#FAFAFA", // Very light grey
  });

  // Part 1: Branches
  const group1 = new sd.Group({ targetNode: svg });
  await playPart1(group1);
  group1.startAnimate().setOpacity(0).endAnimate();
  await sd.pause(500);
  // 移除 group1 以释放资源（虽然 JS 会 GC，但在 SVG DOM 中移除更好，不过框架好像没有 removeChild？
  // 暂时只隐藏。

  // Part 2: Version 1
  const group2 = new sd.Group({ targetNode: svg });
  group2.setOpacity(0);
  group2.startAnimate().setOpacity(1).endAnimate();
  await playPart2(group2);
  group2.startAnimate().setOpacity(0).endAnimate();
  await sd.pause(500);

  // Part 3: Version 2
  const group3 = new sd.Group({ targetNode: svg });
  group3.setOpacity(0);
  group3.startAnimate().setOpacity(1).endAnimate();
  await playPart3(group3);
  group3.startAnimate().setOpacity(0).endAnimate();
  await sd.pause(500);

  // Part 4: Simplify
  const group4 = new sd.Group({ targetNode: svg });
  group4.setOpacity(0);
  group4.startAnimate().setOpacity(1).endAnimate();
  await playPart4(group4);

  // End
  const endText = new sd.Text({
    targetNode: svg,
    text: "Thanks",
    x: 600,
    y: 300,
    fontSize: 80,
    fill: "#333",
    opacity: 0,
  });
  endText.setCenterX(600).setCenterY(300);
  group4.startAnimate().setOpacity(0).endAnimate();
  endText.startAnimate().setOpacity(1).endAnimate();
});

import * as sd from "@/sd";

export async function playPart2(group: sd.Group) {
  // 标题
  const title = new sd.Text({
    targetNode: group,
    text: "Version 1: Reversible Scheduler",
    x: 600,
    y: 50,
    fontSize: 36,
    fill: "#333",
    opacity: 0,
  });
  title.setCenterX(600);
  title.startAnimate().setOpacity(1).endAnimate();
  await sd.pause();

  // 时间轴
  const timelineY = 300;
  const timeline = new sd.Line({
    targetNode: group,
    x1: 100,
    y1: timelineY,
    x2: 100,
    y2: timelineY,
    stroke: "#555",
    strokeWidth: 4,
  });
  timeline.startAnimate({ duration: 1000 }).setX2(1100).endAnimate();
  await sd.pause();

  // Action 块
  const actions = [
    { x: 200, w: 150, color: "#81C784", name: "Action 1" },
    { x: 400, w: 100, color: "#64B5F6", name: "Action 2" },
    { x: 600, w: 200, color: "#BA68C8", name: "Action 3" },
  ];

  const actionRects: sd.Rect[] = [];
  const rectHeight = 50;
  const rectY = timelineY - rectHeight - 10;

  actions.forEach((act, index) => {
    const rect = new sd.Rect({
      targetNode: group,
      x: act.x,
      y: rectY,
      width: 0,
      height: rectHeight,
      fill: act.color,
      opacity: 0.8,
      rx: 5,
      ry: 5,
    });
    actionRects.push(rect);

    // 依次出现
    const delay = index * 200;
    rect.startAnimate({ delay, duration: 500 }).setWidth(act.w).endAnimate();

    const text = new sd.Text({
      targetNode: group,
      text: act.name,
      x: act.x,
      y: rectY + rectHeight / 2,
      fontSize: 16,
      fill: "#fff",
      opacity: 0,
    });
    text.setCenterX(act.x + act.w / 2).setCenterY(rectY + rectHeight / 2);
    text
      .startAnimate({ delay: delay + 200, duration: 300 })
      .setOpacity(1)
      .endAnimate();
  });
  await sd.pause();

  // Pause 标记
  const pauseMark = new sd.Group({ targetNode: group });
  const pauseLine = new sd.Line({
    targetNode: pauseMark,
    x1: 575,
    y1: timelineY - 20,
    x2: 575,
    y2: timelineY + 20,
    stroke: "#FF5252",
    strokeWidth: 2,
    strokeDashArray: "5,5",
  });
  const pauseText = new sd.Text({
    targetNode: pauseMark,
    text: "sd.pause()",
    x: 575,
    y: timelineY + 40,
    fontSize: 14,
    fill: "#FF5252",
  });
  pauseText.setCenterX(575);

  pauseMark.setOpacity(0);
  pauseMark.startAnimate().setOpacity(1).endAnimate();
  await sd.pause();

  // 播放指针
  const pointerGroup = new sd.Group({ targetNode: group });
  const pointerShape = new sd.Polygon({
    targetNode: pointerGroup,
    points: "-10,-20 10,-20 0,0",
    fill: "#333",
  });

  // 初始位置在 100
  pointerGroup.setTranslate(100, timelineY - 5);

  // 提示暂停
  const pauseHint = new sd.Text({
    targetNode: group,
    text: "Paused...",
    x: 575,
    y: timelineY + 70,
    fontSize: 18,
    fill: "#FF5252",
    opacity: 0,
  });
  pauseHint.setCenterX(575);

  // 动画：播放 -> 暂停 -> 继续
  // 1. 移动到 pause 处
  pointerGroup
    .startAnimate({ duration: 1500 })
    .setTranslate(575, timelineY - 5)
    .endAnimate();

  await sd.pause();

  // 2. 提示出现
  pauseHint.startAnimate({ duration: 500 }).setOpacity(1).endAnimate();

  // 3. 提示消失
  pauseHint
    .startAnimate({ delay: 500, duration: 500 })
    .setOpacity(0)
    .endAnimate();

  // 4. 继续播放
  pointerGroup
    .startAnimate({ delay: 1000, duration: 1500 })
    .setTranslate(1100, timelineY - 5)
    .endAnimate();

  await sd.pause();

  // 强调可逆 (Reversible)
  const revText = new sd.Text({
    targetNode: group,
    text: "Reversible!",
    x: 600,
    y: 500,
    fontSize: 30,
    fill: "#1976D2",
    opacity: 0,
  });
  revText.setCenterX(600);
  revText.startAnimate().setOpacity(1).endAnimate();

  // 倒带
  pointerGroup
    .startAnimate({ delay: 1000, duration: 2000 })
    .setTranslate(100, timelineY - 5)
    .endAnimate();
  await sd.pause();
}

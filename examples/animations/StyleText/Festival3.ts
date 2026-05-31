import * as sd from "@/sd";

sd.main(async () => {
  const svg = sd.svg();

  // 1. 背景：深红色充满画布
  new sd.Rect({
    targetNode: svg,
    x: 0,
    y: 0,
    width: 1200,
    height: 600,
    fill: "#8B0000",
  });

  // 2. 装饰：随机飘动的金色光点
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 1200;
    const cy = Math.random() * 600;
    const r = Math.random() * 3 + 1;
    const circle = new sd.Circle({
      targetNode: svg,
      cx: cx,
      cy: cy,
      r: r,
      fill: "#FFD700",
      opacity: Math.random() * 0.5 + 0.2,
    });

    // 闪烁动画
    const duration = 1000 + Math.random() * 1500;
    const delay = Math.random() * 2000;

    circle.startAnimate({ delay, duration }).setOpacity(0.1).endAnimate();

    circle
      .startAnimate({ delay: delay + duration, duration })
      .setOpacity(0.8)
      .endAnimate();
  }

  // 3. 装饰：左右两边的灯笼
  createLantern(svg, 120, 160);
  createLantern(svg, 1080, 160);

  // 4. 文字：你好，世界
  // 创建阴影层以增加立体感
  const textShadow = new sd.Text({
    targetNode: svg,
    text: "你好，世界",
    fontSize: 120,
    fontFamily: "Arial",
    fill: "#3E2723",
    opacity: 0,
  });
  textShadow.setCenterX(605).setCenterY(305);

  // 创建主体文字层
  const textMain = new sd.Text({
    targetNode: svg,
    text: "你好，世界",
    fontSize: 120,
    fontFamily: "Arial",
    fill: "#FFD700", // 金色
    stroke: "#FF6F00", // 橙色描边
    strokeWidth: 2,
    opacity: 0,
  });
  textMain.setCenterX(600).setCenterY(300);

  // 初始状态：缩小
  textShadow.setScale(0.5);
  textMain.setScale(0.5);

  await sd.pause(500);

  // 动画：文字浮现并放大
  const animConfig = { duration: 1200 };

  textShadow.startAnimate(animConfig).setOpacity(0.5).setScale(1).endAnimate();

  textMain.startAnimate(animConfig).setOpacity(1).setScale(1).endAnimate();

  await sd.pause(1500);

  // 动画：文字呼吸效果
  const breathDuration = 1500;

  textShadow
    .startAnimate({ duration: breathDuration })
    .setScale(1.05)
    .endAnimate();
  textMain
    .startAnimate({ duration: breathDuration })
    .setScale(1.05)
    .endAnimate();

  textShadow
    .startAnimate({ delay: breathDuration, duration: breathDuration })
    .setScale(1.0)
    .endAnimate();
  textMain
    .startAnimate({ delay: breathDuration, duration: breathDuration })
    .setScale(1.0)
    .endAnimate();
});

// 辅助函数：创建灯笼
function createLantern(svg: any, x: number, y: number) {
  // 挂绳
  new sd.Line({
    targetNode: svg,
    x1: x,
    y1: 0,
    x2: x,
    y2: y - 6,
    stroke: "#FFD700",
    strokeWidth: 2,
  });

  // 灯笼主体
  new sd.Ellipse({
    targetNode: svg,
    cx: x,
    cy: y,
    rx: 60,
    ry: 50,
    fill: "#D50000", // 鲜红
    stroke: "#FFD700",
    strokeWidth: 2,
  });

  // 灯笼顶部装饰
  new sd.Rect({
    targetNode: svg,
    x: x - 20,
    y: y - 55,
    width: 40,
    height: 10,
    fill: "#FFD700",
  });

  // 灯笼底部装饰
  new sd.Rect({
    targetNode: svg,
    x: x - 20,
    y: y + 45,
    width: 40,
    height: 10,
    fill: "#FFD700",
  });

  // 穗子
  new sd.Line({
    targetNode: svg,
    x1: x,
    y1: y + 55,
    x2: x,
    y2: y + 120,
    stroke: "#FFD700",
    strokeWidth: 3,
  });
}

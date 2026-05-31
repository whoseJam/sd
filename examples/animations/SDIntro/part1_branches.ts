import * as sd from "@/sd";

export async function playPart1(group: sd.Group) {
  const title = new sd.Text({
    targetNode: group,
    text: "SD Animation Timeline",
    x: 600,
    y: 50,
    fontSize: 40,
    fill: "#333",
    opacity: 0,
  });
  title.setCenterX(600);
  title.startAnimate().setOpacity(1).endAnimate();

  const startX = 100;
  const endX = 1100;
  const axisY = 300;

  const coreCircle = new sd.Circle({
    targetNode: group,
    cx: startX,
    cy: axisY,
    r: 0,
    fill: "#64B5F6",
    stroke: "none",
  });
  const coreText = new sd.Text({
    targetNode: group,
    text: "SD Core",
    x: startX,
    y: axisY + 40,
    fontSize: 20,
    fill: "#64B5F6",
    opacity: 0,
  });

  coreCircle.startAnimate().setR(15).endAnimate();
  coreText.setCenterX(startX);
  coreText.startAnimate().setOpacity(1).endAnimate();
  await sd.pause(500);

  const mainLine = new sd.Line({
    targetNode: group,
    x1: startX,
    y1: axisY,
    x2: startX,
    y2: axisY,
    stroke: "#B0BEC5",
    strokeWidth: 6,
    strokeLineCap: "round",
  });

  const versions = [
    {
      name: "Version 1",
      x: 400,
      color: "#81C784",
      desc: "Reversible Scheduler",
      offset: -120,
    },
    {
      name: "Version 2",
      x: 700,
      color: "#7986CB",
      desc: "Reactive System",
      offset: 120,
    },
    {
      name: "Simplify",
      x: 1000,
      color: "#E57373",
      desc: "AI Friendly",
      offset: -120,
    },
  ];

  for (const ver of versions) {
    mainLine.startAnimate().setX2(ver.x).endAnimate();
    await sd.pause(500);

    const tick = new sd.Circle({
      targetNode: group,
      cx: ver.x,
      cy: axisY,
      r: 0,
      fill: "#fff",
      stroke: "#B0BEC5",
      strokeWidth: 3,
    });
    tick.startAnimate().setR(8).endAnimate();

    const branchLine = new sd.Line({
      targetNode: group,
      x1: ver.x,
      y1: axisY,
      x2: ver.x,
      y2: axisY,
      stroke: ver.color,
      strokeWidth: 2,
      strokeDasharray: "5,5",
    });

    const targetY = axisY + ver.offset;
    branchLine.startAnimate().setY2(targetY).endAnimate();
    await sd.pause(300);

    const cardW = 200;
    const cardH = 80;
    const cardX = ver.x - cardW / 2;
    const cardY = targetY - cardH / 2;

    const card = new sd.Rect({
      targetNode: group,
      x: ver.x,
      y: targetY,
      width: 0,
      height: 0,
      fill: ver.color,
      rx: 8,
      ry: 8,
    });

    card
      .startAnimate()
      .setX(cardX)
      .setY(cardY)
      .setWidth(cardW)
      .setHeight(cardH)
      .endAnimate();

    await sd.pause(300);

    const titleText = new sd.Text({
      targetNode: group,
      text: ver.name,
      x: ver.x,
      cy: targetY - 15,
      fontSize: 22,
      fill: "#fff",
      opacity: 0,
      fontWeight: "bold",
    });

    const descText = new sd.Text({
      targetNode: group,
      text: ver.desc,
      x: ver.x,
      cy: targetY + 15,
      fontSize: 16,
      fill: "#fff",
      opacity: 0,
    });

    titleText.setCenterX(ver.x);
    descText.setCenterX(ver.x);

    titleText.startAnimate().setOpacity(1).endAnimate();
    descText.startAnimate().setOpacity(1).endAnimate();

    await sd.pause();
  }

  mainLine.startAnimate().setX2(endX).endAnimate();
}

import * as sd from "@/sd";

sd.main(async () => {
  const svg = sd.svg();

  const bg = new sd.Rect({
    x: 0,
    y: 0,
    width: 1200,
    height: 600,
    fill: "#080808",
  });
  svg.appendChild(bg);

  for (let i = 0; i < 600; i += 50) {
    svg.appendChild(
      new sd.Line({
        x1: 0,
        y1: i,
        x2: 1200,
        y2: i,
        stroke: "#151515",
        strokeWidth: 2,
      }),
    );
    for (let j = 0; j < 1200; j += 100) {
      let off = (i / 50) % 2 === 0 ? 0 : 50;
      svg.appendChild(
        new sd.Line({
          x1: j + off,
          y1: i,
          x2: j + off,
          y2: i + 50,
          stroke: "#151515",
          strokeWidth: 2,
        }),
      );
    }
  }

  const tStyle = {
    text: "你好，世界",
    fontSize: 90,
    fontFamily: "Arial",
    fontWeight: "bold",
  };

  const tMain = new sd.Text({
    ...tStyle,
    fill: "#fff",
    stroke: "#ff00ff",
    strokeWidth: 2,
  });
  const tGlow = new sd.Text({
    ...tStyle,
    fill: "none",
    stroke: "#d600ff",
    strokeWidth: 12,
    strokeOpacity: 0.2,
  });

  const textWidth = tMain.getWidth();
  const paddingX = 80;
  const paddingY = 70;

  const boxW = textWidth + paddingX * 2;
  const boxH = tStyle.fontSize + paddingY * 2;
  const centerX = 600;
  const centerY = 300;
  const boxX = centerX - boxW / 2;
  const boxY = centerY - boxH / 2;

  const box = { x: boxX, y: boxY, w: boxW, h: boxH };

  const frameOut = new sd.Rect({
    x: box.x - 10,
    y: box.y - 10,
    width: box.w + 20,
    height: box.h + 20,
    rx: 15,
    fill: "none",
    stroke: "#333",
    strokeWidth: 8,
  });
  svg.appendChild(frameOut);

  const borderGlow = new sd.Rect({
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
    rx: 10,
    fill: "none",
    stroke: "#ff00ff",
    strokeWidth: 8,
    strokeOpacity: 0.2,
  });
  svg.appendChild(borderGlow);
  const border = new sd.Rect({
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
    rx: 10,
    fill: "none",
    stroke: "#ff00ff",
    strokeWidth: 3,
  });
  svg.appendChild(border);

  const barTop = new sd.Rect({
    x: box.x + 50,
    y: box.y - 25,
    width: box.w - 100,
    height: 10,
    rx: 5,
    fill: "#00ffff",
    opacity: 0.8,
  });
  svg.appendChild(barTop);
  const barBottom = new sd.Rect({
    x: box.x + 50,
    y: box.y + box.h + 15,
    width: box.w - 100,
    height: 10,
    rx: 5,
    fill: "#00ffff",
    opacity: 0.8,
  });
  svg.appendChild(barBottom);

  tGlow.setCenterX(centerX).setCenterY(centerY);
  svg.appendChild(tGlow);

  tMain.setCenterX(centerX).setCenterY(centerY);
  svg.appendChild(tMain);

  sd.loopUpdate((t) => {
    const cycle = t % 6000;
    let on = true;
    if (cycle < 200) {
      if (Math.random() > 0.6) on = false;
    } else if (cycle > 3000 && cycle < 3100) {
      if (Math.random() > 0.8) on = false;
    }

    const opacity = on ? 1 : 0.1;
    const breathe = 0.8 + Math.sin(t * 0.003) * 0.2;

    tMain.setOpacity(opacity);
    tGlow.setOpacity(opacity * breathe * 0.5);
    border.setOpacity(opacity * 0.9);
    borderGlow.setOpacity(opacity * breathe * 0.4);

    const hue = (t * 0.02) % 360;
    const color = `hsl(${hue}, 100%, 50%)`;
    barTop.setFill(color);
    barBottom.setFill(color);
  });
});

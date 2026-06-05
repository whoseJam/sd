import * as sd from "@/sd";

sd.main(async () => {
  const svg = sd.svg();

  const halo1 = new sd.Circle({
    cx: 600,
    cy: 300,
    r: 0,
    fill: "#D32F2F",
    opacity: 0.1,
  });
  svg.appendChild(halo1);

  const halo2 = new sd.Circle({
    cx: 600,
    cy: 300,
    r: 0,
    fill: "#FF5722",
    opacity: 0.1,
  });
  svg.appendChild(halo2);

  const ring = new sd.Circle({
    cx: 600,
    cy: 300,
    r: 220,
    fill: "none",
    stroke: "#FFD700",
    strokeWidth: 2,
    strokeDashArray: "20, 10",
    opacity: 0,
  });
  svg.appendChild(ring);

  const title = new sd.Text({
    text: "新春快乐",
    fontSize: 120,
    fill: "#FFD700",
    stroke: "#B71C1C",
    strokeWidth: 4,
    opacity: 0,
    scale: 0.5,
  });
  svg.appendChild(title);
  title.setCx(600).setCy(300);

  const subTitle = new sd.Text({
    text: "HAPPY NEW YEAR",
    fontSize: 40,
    fill: "#FFC107",
    opacity: 0,
    y: 380,
  });
  svg.appendChild(subTitle);
  subTitle.setCx(600);

  const particles = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    // 调整为椭圆分布以适应文字形状
    const rx = 340;
    const ry = 200;
    const p = new sd.Circle({
      cx: 600 + Math.cos(angle) * rx,
      cy: 300 + Math.sin(angle) * ry,
      r: 6 + Math.random() * 5,
      fill: "#FFD700",
      opacity: 0,
    });
    svg.appendChild(p);
    particles.push(p);
  }

  await sd.pause(500);

  halo1.startAnimate({ duration: 1000 }).setR(250).setOpacity(0.2).endAnimate();
  halo2
    .startAnimate({ duration: 1200, delay: 200 })
    .setR(300)
    .setOpacity(0.15)
    .endAnimate();

  ring
    .startAnimate({ duration: 1500 })
    .setOpacity(0.6)
    .setRotate(180)
    .endAnimate();

  title.startAnimate({ duration: 800 }).setOpacity(1).setScale(1).endAnimate();

  subTitle
    .startAnimate({ duration: 800, delay: 400 })
    .setOpacity(1)
    .setY(400)
    .endAnimate();

  particles.forEach((p, i) => {
    p.startAnimate({ duration: 600, delay: 600 + i * 100 })
      .setOpacity(1)
      .setScale(1.2)
      .endAnimate();
  });

  await sd.pause(2000);

  title.startAnimate({ duration: 2000 }).setScale(1.05).endAnimate();
  halo1.startAnimate({ duration: 2000 }).setR(260).endAnimate();
  halo2.startAnimate({ duration: 2000 }).setR(310).endAnimate();
  ring.startAnimate({ duration: 2000 }).setRotate(360).endAnimate();

  await sd.pause(2000);

  title.startAnimate({ duration: 2000 }).setScale(1).endAnimate();
  halo1.startAnimate({ duration: 2000 }).setR(250).endAnimate();
  halo2.startAnimate({ duration: 2000 }).setR(300).endAnimate();
});

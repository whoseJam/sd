import * as sd from "@/sd";

const svg = sd.svg();

// 1. 背景：极深蓝紫色，模拟夜空
const bg = new sd.Rect({
  width: 1200,
  height: 600,
  fill: "#020205",
});
svg.appendChild(bg);

// 2. 定义滤镜
// 滤镜1：强力高斯模糊，用于背景辉光
const filterGlow = new sd.Filter({
  id: "neon-glow",
  x: "-100%",
  y: "-100%",
  width: "300%",
  height: "300%",
});
filterGlow.appendChild(new sd.GaussianBlur({ stdDeviation: 15 }));
svg.appendChild(filterGlow);

// 滤镜2：轻微模糊，用于边缘柔化
const filterSoft = new sd.Filter({
  id: "neon-soft",
  x: "-50%",
  y: "-50%",
  width: "200%",
  height: "200%",
});
filterSoft.appendChild(new sd.GaussianBlur({ stdDeviation: 4 }));
svg.appendChild(filterSoft);

// 3. 文字配置
const textStr = "你好，世界";
const font = "Arial";
const size = 130;
const cx = 600;
const cy = 300;

// 4. 创建多层文字叠加
// Layer 1: 紫色环境光 (强模糊)
const layerPurple = new sd.Text({
  text: textStr,
  fontFamily: font,
  fontSize: size,
  fill: "none",
  stroke: "#bc13fe",
  strokeWidth: 12,
  filter: "url(#neon-glow)", // 应用强模糊
  opacity: 0.8,
});
layerPurple.setCx(cx).setCy(cy);
svg.appendChild(layerPurple);

// Layer 2: 青色主辉光 (中模糊)
const layerCyan = new sd.Text({
  text: textStr,
  fontFamily: font,
  fontSize: size,
  fill: "none",
  stroke: "#00f3ff",
  strokeWidth: 6,
  filter: "url(#neon-soft)", // 应用弱模糊
  opacity: 0.9,
});
layerCyan.setCx(cx).setCy(cy);
svg.appendChild(layerCyan);

// Layer 3: 灯管核心 (高亮实心)
const layerCore = new sd.Text({
  text: textStr,
  fontFamily: font,
  fontSize: size,
  fill: "#e0ffff",
  fillOpacity: 0.2, // 内部淡淡的充气感
  stroke: "#ffffff",
  strokeWidth: 2, // 边缘锐利的高亮
  opacity: 1,
});
layerCore.setCx(cx).setCy(cy);
svg.appendChild(layerCore);

// 5. 动画逻辑
sd.loopUpdate((t: number) => {
  // 基础呼吸节奏 (2秒一个周期)
  const breath = (Math.sin(t / 300) + 1) / 2;

  // 随机故障闪烁逻辑
  let flicker = 1;
  // 每隔几秒可能触发一次故障序列
  if (t % 4000 < 300) {
    // 在故障窗口期，高频随机闪烁
    if (Math.random() > 0.7) flicker = 0.2;
    if (Math.random() > 0.9) flicker = 0;
  }

  // 组合透明度
  const alpha = (0.8 + 0.2 * breath) * flicker;

  // 动态调整各层
  // 紫色层：作为背景光，呼吸感强，受闪烁影响小一点
  layerPurple.setOpacity(0.6 + 0.2 * breath);

  // 青色层：主光源，受闪烁影响大
  layerCyan.setOpacity(alpha);

  // 核心层：保持高亮，但随闪烁剧烈变化
  layerCore.setOpacity(flicker > 0.5 ? 1 : 0.3);

  // 细微的位置抖动 (模拟电流不稳定)
  if (flicker < 1) {
    const shakeX = (Math.random() - 0.5) * 4;
    const shakeY = (Math.random() - 0.5) * 4;
    layerCyan.setCx(cx + shakeX).setCy(cy + shakeY);
  } else {
    layerCyan.setCx(cx).setCy(cy);
  }
});

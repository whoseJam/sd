import * as sd from "@/sd";

const svg = sd.svg();

// 1. 背景：深色，模拟夜间或屏幕关闭状态
new sd.Rect({
    targetNode: svg,
    width: 1200,
    height: 600,
    fill: "#080808",
});

// 2. 定义滤镜
// 霓虹灯辉光效果：多层阴影叠加
const neonFilter = new sd.Filter({
    targetNode: svg,
    id: "neonGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
});
// 内层高亮
new sd.DropShadow({
    targetNode: neonFilter,
    dx: 0,
    dy: 0,
    stdDeviation: 2,
    floodColor: "#ffffff",
    floodOpacity: 0.9,
});
// 外层辉光 - 青色
new sd.DropShadow({
    targetNode: neonFilter,
    dx: 0,
    dy: 0,
    stdDeviation: 10,
    floodColor: "#00ffff",
    floodOpacity: 0.6,
});
// 外层辉光 - 紫色 (增加层次感)
new sd.DropShadow({
    targetNode: neonFilter,
    dx: 0,
    dy: 0,
    stdDeviation: 20,
    floodColor: "#ff00ff",
    floodOpacity: 0.4,
});

// 3. 文本配置
const textConfig = {
    text: "你好，世界",
    fontSize: 120,
    fontFamily: "Arial",
    targetNode: svg,
    fillOpacity: 1,
};

// 4. 创建文本层
// 辅助层：红色通道（用于故障时的色差）
const textRed = new sd.Text({
    ...textConfig,
    fill: "#ff0000",
    fillOpacity: 0.7,
});
// 辅助层：青色通道
const textCyan = new sd.Text({
    ...textConfig,
    fill: "#00ffff",
    fillOpacity: 0.7,
});
// 主文本层
const textMain = new sd.Text({
    ...textConfig,
    fill: "#ffffff",
    filter: neonFilter, // 主层应用霓虹滤镜
});

// 初始定位
const cx = 600;
const cy = 300;
textRed.setCenterX(cx).setCenterY(cy);
textCyan.setCenterX(cx).setCenterY(cy);
textMain.setCenterX(cx).setCenterY(cy);

// 5. 故障扫描线 (简约风格，一条细线)
const scanLine = new sd.Rect({
    targetNode: svg,
    width: 1200,
    height: 2,
    fill: "#ffffff",
    fillOpacity: 0.1,
    y: -10,
});

// 6. 随机噪点块
const noiseRects = Array.from({ length: 3 }).map(
    () =>
        new sd.Rect({
            targetNode: svg,
            fill: "#ffffff",
            fillOpacity: 0,
        })
);

// 7. 动画循环
sd.loopUpdate((t: number) => {
    // 扫描线移动
    const scanY = ((t * 0.4) % 650) - 25;
    scanLine.setY(scanY);

    // 随机故障触发概率
    const isGlitch = Math.random() < 0.06;

    if (isGlitch) {
        // 故障状态
        const offset = (Math.random() - 0.5) * 15;
        const vOffset = (Math.random() - 0.5) * 4;

        // 色差分离
        textRed.setCenterX(cx + offset).setCenterY(cy + vOffset);
        textCyan.setCenterX(cx - offset).setCenterY(cy - vOffset);
        textMain.setCenterX(cx).setCenterY(cy);

        // 随机透明度（闪烁）
        textMain.setFillOpacity(0.2 + Math.random() * 0.8);

        // 噪点块随机出现
        noiseRects.forEach(r => {
            if (Math.random() > 0.5) {
                r.setX(cx - 400 + Math.random() * 800)
                    .setY(cy - 100 + Math.random() * 200)
                    .setWidth(Math.random() * 100 + 10)
                    .setHeight(Math.random() * 4 + 1)
                    .setFill(Math.random() > 0.5 ? "#00ffff" : "#ff00ff")
                    .setFillOpacity(0.5);
            } else {
                r.setFillOpacity(0);
            }
        });
    } else {
        // 正常状态（带微弱呼吸浮动）
        const float = Math.sin(t * 0.003) * 2;
        textRed.setCenterX(cx).setCenterY(cy + float);
        textCyan.setCenterX(cx).setCenterY(cy + float);
        textMain.setCenterX(cx).setCenterY(cy + float);

        textMain.setFillOpacity(1);
        noiseRects.forEach(r => r.setFillOpacity(0));
    }
});

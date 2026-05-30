import * as sd from "@/sd";

const svg = sd.svg();

new sd.Rect({
    targetNode: svg,
    width: 1200,
    height: 600,
    fill: "#050505",
});

const baseConfig = {
    text: "你好，世界",
    fontSize: 120,
    fontFamily: "Arial",
    targetNode: svg,
    fillOpacity: 0.8,
};

const cyanGlow = new sd.Filter({
    targetNode: svg,
    id: "cyanGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
});
new sd.DropShadow({
    targetNode: cyanGlow,
    dx: 0,
    dy: 0,
    stdDeviation: 5,
    floodColor: "#00ffff",
    floodOpacity: 1,
});

const redGlow = new sd.Filter({
    targetNode: svg,
    id: "redGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
});
new sd.DropShadow({
    targetNode: redGlow,
    dx: 0,
    dy: 0,
    stdDeviation: 5,
    floodColor: "#ff0000",
    floodOpacity: 1,
});

const whiteGlow = new sd.Filter({
    targetNode: svg,
    id: "whiteGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
});
new sd.DropShadow({
    targetNode: whiteGlow,
    dx: 0,
    dy: 0,
    stdDeviation: 5,
    floodColor: "#ffffff",
    floodOpacity: 0.8,
});

const textCyan = new sd.Text({ ...baseConfig, fill: "#00ffff", filter: cyanGlow });
textCyan.setCenterX(600).setCenterY(300);

const textRed = new sd.Text({ ...baseConfig, fill: "#ff0000", filter: redGlow });
textRed.setCenterX(600).setCenterY(300);

const textMain = new sd.Text({ ...baseConfig, fill: "#ffffff", fillOpacity: 1, filter: whiteGlow });
textMain.setCenterX(600).setCenterY(300);

const scanLine = new sd.Rect({
    targetNode: svg,
    width: 1200,
    height: 4,
    fill: "#ffffff",
    fillOpacity: 0.1,
    y: -10,
});

const glitchRects = Array.from({ length: 5 }).map(
    () =>
        new sd.Rect({
            targetNode: svg,
            fill: "#ffffff",
            fillOpacity: 0,
        })
);

sd.loopUpdate((t: number) => {
    const scanY = ((t * 0.3) % 650) - 25;
    scanLine.setY(scanY);

    const isGlitch = Math.random() < 0.05;
    const cx = 600;
    const cy = 300;

    if (isGlitch) {
        const ox = (Math.random() - 0.5) * 40;
        const oy = (Math.random() - 0.5) * 10;

        textCyan.setCenterX(cx + ox).setCenterY(cy + oy);
        textRed.setCenterX(cx - ox).setCenterY(cy - oy);
        textMain.setCenterX(cx + ox * 0.2).setCenterY(cy);

        glitchRects.forEach(r => {
            if (Math.random() > 0.5) {
                r.setX(cx + (Math.random() - 0.5) * 600)
                    .setY(cy + (Math.random() - 0.5) * 150)
                    .setWidth(Math.random() * 100 + 20)
                    .setHeight(Math.random() * 10 + 2)
                    .setFillOpacity(Math.random() * 0.5)
                    .setFill(Math.random() > 0.5 ? "#00ffff" : "#ff0000");
            } else {
                r.setFillOpacity(0);
            }
        });
    } else {
        const ocx = (Math.random() - 0.5) * 4;
        const ocy = (Math.random() - 0.5) * 2;
        const orx = (Math.random() - 0.5) * 4;
        const ory = (Math.random() - 0.5) * 2;

        textCyan.setCenterX(cx + ocx).setCenterY(cy + ocy);
        textRed.setCenterX(cx + orx).setCenterY(cy + ory);
        textMain.setCenterX(cx).setCenterY(cy);

        glitchRects.forEach(r => r.setFillOpacity(0));
    }

    textMain.setFillOpacity(Math.random() < 0.1 ? 0.8 + Math.random() * 0.2 : 1);
});

import * as sd from "@/sd";

sd.main(async () => {
    const svg = sd.svg();

    const bg = new sd.Rect({
        targetNode: svg,
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        fill: "#8B0000",
    });

    const lights: any[] = [];
    for (let i = 0; i < 30; i++) {
        const light = new sd.Circle({
            targetNode: svg,
            cx: Math.random() * 1200,
            cy: Math.random() * 600,
            r: Math.random() * 4 + 2,
            fill: "#FFD700",
            fillOpacity: Math.random() * 0.5 + 0.2,
        });
        lights.push(light);
    }

    const lanternX = [100, 1100, 200, 1000];
    const lanternY = [100, 100, 200, 200];
    for (let i = 0; i < lanternX.length; i++) {
        new sd.Line({
            targetNode: svg,
            x1: lanternX[i],
            y1: 0,
            x2: lanternX[i],
            y2: lanternY[i],
            stroke: "#FFD700",
            strokeWidth: 2,
        });
        new sd.Circle({
            targetNode: svg,
            cx: lanternX[i],
            cy: lanternY[i],
            r: 40,
            fill: "#FF0000",
            stroke: "#FFD700",
            strokeWidth: 3,
        });
    }

    const text = new sd.Text({
        targetNode: svg,
        text: "你好，世界",
        fontSize: 120,
        fill: "#FFD700",
        fontFamily: "Times New Roman",
        stroke: "#FF4500",
        strokeWidth: 3,
        opacity: 0,
    });

    text.setCenterX(600).setCenterY(300);
    text.setScale(0.5);

    await sd.pause(500);

    text.startAnimate({ duration: 1500 }).setOpacity(1).setScale(1).endAnimate();

    for (const light of lights) {
        const delay = Math.random() * 1000;
        light.startAnimate({ duration: 1000, delay: delay }).setFillOpacity(0.8).endAnimate();
        light
            .startAnimate({ duration: 1000, delay: delay + 1000 })
            .setFillOpacity(0.2)
            .endAnimate();
    }

    await sd.pause();
});

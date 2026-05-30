import * as sd from "@/sd";

sd.main(async () => {
    const svg = sd.svg();
    const bg = new sd.Rect({
        targetNode: svg,
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        fill: "#A61C00",
    });

    const halo = new sd.Circle({
        targetNode: svg,
        cx: 600,
        cy: 300,
        r: 0,
        fill: "#FFD700",
        fillOpacity: 0.2,
    });

    const particles = [];
    for (let i = 0; i < 30; i++) {
        const p = new sd.Circle({
            targetNode: svg,
            cx: Math.random() * 1200,
            cy: Math.random() * 600,
            r: Math.random() * 5 + 2,
            fill: "#FFD700",
            fillOpacity: 0.6,
            opacity: 0,
        });
        particles.push(p);
    }

    const text = new sd.Text({
        targetNode: svg,
        text: "你好，世界",
        fontSize: 100,
        fill: "#FFD700",
        opacity: 0,
        scale: 0.5,
    });
    text.setCenterX(600).setCenterY(300);

    halo.startAnimate({ duration: 1000 }).setR(250).endAnimate();

    for (let i = 0; i < particles.length; i++) {
        particles[i]
            .startAnimate({ delay: Math.random() * 800, duration: 1000 })
            .setOpacity(1)
            .setCy(particles[i].getCy() - 30)
            .endAnimate();
    }

    text.startAnimate({ delay: 500, duration: 1000 }).setOpacity(1).setScale(1).endAnimate();

    await sd.pause(1500);

    text.startAnimate({ duration: 1000 }).setScale(1.1).endAnimate();
    text.startAnimate({ duration: 1000 }).setScale(1.0).endAnimate();
    text.startAnimate({ duration: 1000 }).setScale(1.1).endAnimate();
    text.startAnimate({ duration: 1000 }).setScale(1.0).endAnimate();

    await sd.pause();
});

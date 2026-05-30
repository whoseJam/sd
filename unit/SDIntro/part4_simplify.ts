import * as sd from "@/sd";

export async function playPart4(group: sd.Group) {
    // 标题
    const title = new sd.Text({
        targetNode: group,
        text: "Simplify: AI Friendly",
        x: 600,
        y: 50,
        fontSize: 36,
        fill: "#333",
        opacity: 0,
    });
    title.setCenterX(600);
    title.startAnimate().setOpacity(1).endAnimate();

    // 初始词组：抽象概念
    const startTerms = ["Array", "Box", "Graph", "Tree"];
    // 目标词组：核心组件
    const endTerms = ["Rect", "Circle", "Line", "Text"];
    const texts: sd.Text[] = [];

    // 1. 入场：随机散布，体现"无序"
    for (let i = 0; i < startTerms.length; i++) {
        const randX = 300 + Math.random() * 600;
        const randY = 200 + Math.random() * 200;

        const t = new sd.Text({
            targetNode: group,
            text: startTerms[i],
            x: randX,
            y: randY,
            fontSize: 32,
            fill: "#546E7A",
            opacity: 0,
        });
        t.setCenterX(randX).setCenterY(randY);
        t.setScale(0.5);
        texts.push(t);

        t.startAnimate({ delay: i * 100, duration: 800 })
            .setOpacity(1)
            .setScale(1)
            .endAnimate();
    }

    await sd.pause();

    // 2. 变换：字形变换 + 归位
    for (let i = 0; i < texts.length; i++) {
        const t = texts[i];
        const targetX = 300 + i * 200;
        const targetY = 450;

        t.startAnimate({ delay: i * 100, duration: 1200 })
            .setText(endTerms[i])
            .setFill("#1E88E5")
            .setCenterX(targetX)
            .setCenterY(targetY)
            .setRotate(0)
            .setFontSize(28)
            .endAnimate();
    }

    await sd.pause();

    // 图形展示
    const shapes: any = [];
    const shapeY = 350;
    const shapeColor = "#1E88E5";

    // 1. Rect
    const rect = new sd.Rect({
        targetNode: group,
        x: 0,
        y: 0,
        width: 80,
        height: 80,
        fill: "transparent",
        stroke: shapeColor,
        strokeWidth: 4,
        opacity: 0,
    });
    rect.setCenterX(300).setCenterY(shapeY);
    shapes.push(rect);

    // 2. Circle
    const circle = new sd.Circle({
        targetNode: group,
        cx: 500,
        cy: shapeY,
        r: 40,
        fill: "transparent",
        stroke: shapeColor,
        strokeWidth: 4,
        opacity: 0,
    });
    shapes.push(circle);

    // 3. Line
    const line = new sd.Line({
        targetNode: group,
        x1: 660,
        y1: 390,
        x2: 740,
        y2: 310,
        stroke: shapeColor,
        strokeWidth: 4,
        opacity: 0,
    });
    shapes.push(line);

    // 4. Text Icon
    const textIcon = new sd.Text({
        targetNode: group,
        text: "Ag",
        x: 900,
        y: shapeY,
        fontSize: 60,
        fill: shapeColor,
        opacity: 0,
    });
    textIcon.setCenterX(900).setCenterY(shapeY);
    shapes.push(textIcon);

    // 动画显示图形
    for (let i = 0; i < shapes.length; i++) {
        shapes[i]
            .startAnimate({ delay: i * 100 })
            .setOpacity(1)
            .endAnimate();
    }

    await sd.pause();

    // 移动所有元素到底部，为 Slogan 让路
    for (const t of texts) {
        t.startAnimate().setCenterY(560).endAnimate();
    }
    // Rect
    shapes[0].startAnimate().setCenterY(500).endAnimate();
    // Circle
    shapes[1].startAnimate().setCy(500).endAnimate();
    // Line
    shapes[2].startAnimate().setY1(540).setY2(460).endAnimate();
    // Text Icon
    shapes[3].startAnimate().setCenterY(500).endAnimate();

    // Less is More
    const slogan = new sd.Text({
        targetNode: group,
        text: "Less is More",
        x: 600,
        y: 300,
        fontSize: 60,
        fill: "#333",
        opacity: 0,
    });
    slogan.setCenterX(600).setCenterY(300);
    slogan.startAnimate().setOpacity(1).endAnimate();

    await sd.pause();

    // Human Friendly -> AI Friendly
    slogan.startAnimate().setOpacity(0).endAnimate();

    const transText1 = new sd.Text({
        targetNode: group,
        text: "Human Friendly",
        x: 300,
        y: 300,
        fontSize: 40,
        fill: "#757575",
        opacity: 0,
    });
    transText1.setCenterX(300).setCenterY(300);

    const arrow = new sd.Path({
        targetNode: group,
        d: "M 500 300 L 700 300 L 685 290 L 700 300 L 685 310",
        stroke: "#333",
        strokeWidth: 4,
        fill: "transparent",
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeDashArray: "300 300",
        strokeDashOffset: 300,
        opacity: 1,
    });

    const transText2 = new sd.Text({
        targetNode: group,
        text: "AI Friendly",
        x: 900,
        y: 300,
        fontSize: 40,
        fill: "#43A047", // Green
        opacity: 0,
    });
    transText2.setCenterX(900).setCenterY(300);

    transText1.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(500);
    arrow.startAnimate({ duration: 800 }).setStrokeDashOffset(0).endAnimate();
    await sd.pause(500);
    transText2.startAnimate().setOpacity(1).endAnimate();

    await sd.pause();

    // 移除响应式系统说明
    const removeReactive = new sd.Text({
        targetNode: group,
        text: "No Implicit Layout",
        x: 600,
        y: 400,
        fontSize: 24,
        fill: "#E53935",
        opacity: 0,
    });
    removeReactive.setCenterX(600);
    removeReactive.startAnimate({ delay: 1000 }).setOpacity(1).endAnimate();

    await sd.pause();
}

import * as sd from "@/sd";

export async function playPart3(group: sd.Group) {
    // 标题
    const title = new sd.Text({
        targetNode: group,
        text: "Version 2: Reactive System",
        x: 600,
        y: 50,
        fontSize: 36,
        fill: "#333",
        opacity: 0,
    });
    title.setCenterX(600);
    title.startAnimate().setOpacity(1).endAnimate();

    // Source Object (A)
    const rectA = new sd.Rect({
        targetNode: group,
        x: 300,
        y: 300,
        width: 100,
        height: 100,
        fill: "#42A5F5",
        rx: 10,
        ry: 10,
    });
    const textA = new sd.Text({
        targetNode: group,
        text: "A",
        x: 300,
        y: 300,
        fontSize: 24,
        fill: "#fff",
    });
    textA.setCenterX(350).setCenterY(350);

    // Dependent Object (B)
    const circleB = new sd.Circle({
        targetNode: group,
        cx: 800,
        cy: 350,
        r: 50,
        fill: "#EF5350",
    });
    const textB = new sd.Text({
        targetNode: group,
        text: "B",
        x: 800,
        y: 350,
        fontSize: 24,
        fill: "#fff",
    });
    textB.setCenterX(800).setCenterY(350);

    // 依赖关系说明
    const depText = new sd.Text({
        targetNode: group,
        text: "B.x = A.x + 500",
        x: 600,
        y: 200,
        fontSize: 20,
        fill: "#666",
        opacity: 0,
    });
    depText.setCenterX(600);
    depText.startAnimate().setOpacity(1).endAnimate();

    // 连线
    const line = new sd.Line({
        targetNode: group,
        x1: 400,
        y1: 350,
        x2: 750,
        y2: 350,
        stroke: "#999",
        strokeWidth: 2,
        strokeDashArray: "5,5",
    });

    await sd.pause();

    // 动画演示：移动 A，B 跟随
    // 注意：这里我们是手动制作动画来模拟响应式效果

    // 第一次移动
    const moveDuration = 1000;
    const targetAX = 400;
    const targetBX = targetAX + 500; // 900

    rectA.startAnimate({ duration: moveDuration }).setX(targetAX).endAnimate();
    const currentTextAX = textA.getX();
    textA
        .startAnimate({ duration: moveDuration })
        .setX(currentTextAX + 100)
        .endAnimate();

    // B 跟随
    circleB.startAnimate({ duration: moveDuration }).setCx(targetBX).endAnimate();
    const currentTextBX = textB.getX();
    textB
        .startAnimate({ duration: moveDuration })
        .setX(currentTextBX + 100)
        .endAnimate();

    // 线条跟随
    line.startAnimate({ duration: moveDuration })
        .setX1(targetAX + 100)
        .setX2(targetBX - 50)
        .endAnimate();

    await sd.pause();

    // 第二次演示：改变颜色依赖
    // B.fill = A.fill (Complementary)
    depText.startAnimate().setOpacity(0).endAnimate();
    await sd.pause(300);
    depText.setText("B.color depends on A.color");
    depText.setCenterX(600);
    depText.startAnimate().setOpacity(1).endAnimate();

    const newColorA = "#66BB6A"; // Green
    const newColorB = "#AB47BC"; // Purple (Just changing to show reaction)

    rectA.startAnimate().setFill(newColorA).endAnimate();
    circleB.startAnimate().setFill(newColorB).endAnimate();

    await sd.pause();
}

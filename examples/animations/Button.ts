import * as sd from "@/sd";

const svg = sd.svg();
const T = sd.timingFunction();

sd.main(TestButtonCallback);

async function TestButtonAnimation() {
    const button = new sd.Button({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        text: "测试按钮",
    });
    await sd.pause();
    button.startAnimate().setX(200).setY(200).setWidth(200).endAnimate();
    button
        .startAnimate({
            easing(t: number) {
                if (t <= 0.5) return 0;
                return 1;
            },
        })
        .setText("动画按钮")
        .endAnimate();
}

async function TestButtonCallback() {
    const button = new sd.Button({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        text: "测试按钮",
    });
    button.onClick(() => {
        console.log("onClick callback triggered");
    });
}

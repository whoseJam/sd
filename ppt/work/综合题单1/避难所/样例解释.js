import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const text = new sd.Math(svg, "{0}p+{0}q");
const arr = new sd.ValueArray(svg).start(1).elementWidth(60);
let lastClicked = undefined;
let pCount = 0;
let qCount = 0;

function updateText() {
    text.startAnimate().transformMath(`{${pCount}}p+{${qCount}}q`).endAnimate();
}

sd.init(() => {
    sd.Index(arr, "b");
    for (let i = 1; i <= n; i++) {
        const circle = new sd.Circle(svg).color(C.grey);
        arr.push(circle);
        circle.onClick(() => {
            if (lastClicked === circle) {
                sd.inter(async () => {
                    circle.startAnimate().opacity(0).endAnimate();
                    pCount += i;
                    updateText();
                    lastClicked = undefined;
                });
            } else if (lastClicked) {
                sd.inter(async () => {
                    lastClicked.startAnimate().opacity(0).endAnimate();
                    circle.startAnimate().opacity(0).endAnimate();
                    qCount += Math.abs(arr.indexOf(lastClicked) - i);
                    updateText();
                    lastClicked = undefined;
                });
            } else {
                sd.inter(async () => {
                    lastClicked = circle;
                    lastClicked.startAnimate().stroke(C.red).endAnimate();
                });
            }
        });
    }
    text.cx(arr.cx()).my(arr.y() - 20);
});

sd.main(async () => {});

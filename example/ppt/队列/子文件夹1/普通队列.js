import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const queue = new sd.Array(svg);
const pushButton = new sd.Button(div).text("push");
const popButton = new sd.Button(div).x(100).text("pop");

sd.init(() => {
    queue.y(30);
    pushButton.onClick(() => {
        sd.inter(async () => {
            queue.startAnimate().push(sd.rand(1, 10)).endAnimate();
        });
    });
    popButton.onClick(() => {
        if (queue.length() === 0) return;
        sd.inter(async () => {
            queue.startAnimate().erase(0).endAnimate();
        });
    });
});

sd.main(async () => {});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.ValueArray(svg).elementWidth(60);

sd.init(() => {
    for (let i = 1; i <= 5; i++)
        arr.push(new sd.Circle(arr).r(15).color(C.ORANGE));
})

sd.main(async () => {
    await sd.pause();

    const rects = [];
    for (let i = 0; i < arr.length() - 1; i++) {
        const x = (arr.element(i).cx() + arr.element(i + 1).cx()) / 2;
        const y = (arr.element(i).cy());
        const rect = new sd.Rect(svg).width(10).cx(x).cy(y);
        rect.opacity(0).startAnimate().opacity(1).endAnimate();
        rects.push(rect);
    }

    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        randomShuffle(rects);
        for (let j = 0; j < rects.length; j++) {
            rects[j].startAnimate().opacity(j < 2 ? 1 : 0).endAnimate();
        }
    }
})

function randomShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = sd.rand(0, i - 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
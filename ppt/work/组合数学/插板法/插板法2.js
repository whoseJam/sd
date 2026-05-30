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

    arr.startAnimate();
    arr.push(new sd.Circle(arr).r(15));
    arr.push(new sd.Circle(arr).r(15));
    arr.endAnimate();

    await sd.pause();

    const ids = [0, 1, 2, 3, 4, 5, 6];

    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        arr.startAnimate().color(C.DEFAULT).endAnimate();
        await sd.pause();
        randomShuffle(ids);
        for (let i = 0; i < ids.length; i++) {
            arr.element(ids[i]).startAnimate().color(
                i < 2 ? C.BLUE : C.ORANGE
            ).endAnimate();
        }
    }
})

function randomShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = sd.rand(0, i - 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
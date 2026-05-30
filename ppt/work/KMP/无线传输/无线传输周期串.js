import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).resize(20).start(1);
sd.Brace(arr).brace(1, 16, "b");
sd.Brace(arr).brace(5, 20, "t");
const rect = new sd.Rect(svg).width(40 * 4).color(C.BLUE).drag(true);

sd.init(() => {
    rect.cx(arr.cx()).y(arr.my() + 20);
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= 5; i += 2) {
        arr.color((i - 1) * 4 + 1, i * 4, C.grey);
    }
    arr.endAnimate();
})

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).pushArray("cabcabcabcabca").start(1);
sd.Brace(arr).brace(1, 11, "b");
sd.Brace(arr).brace(4, 14, "t");

sd.main(async () => {
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= 3; i += 2) {
        arr.color((i - 1) * 3 + 1, i * 3, C.grey);
    }
    arr.endAnimate();
})

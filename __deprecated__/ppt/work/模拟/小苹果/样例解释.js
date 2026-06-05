import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const arr = new sd.ValueArray(svg).elementWidth(60);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Vertex(arr, i).color(C.coral));
    }
});

sd.main(async () => {
    while (arr.length() > 0) {
        await sd.pause();
        arr.startAnimate();
        for (let i = arr.length() - 1; i >= 0; i--) {
            if (i % 3 === 0) arr.erase(i);
        }
        arr.endAnimate();
    }
});

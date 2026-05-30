import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);
let count = 0;

sd.init(() => {
    sd.Label(arr, "差值数组", "lc");
    sd.Index(arr, "t");
    for (let i = 1; i <= n; i++) {
        if (sd.rand(1, 10) <= 3) arr.color(i, C.white), count++;
        else arr.color(i, C.blue);
    }
});

sd.main(async () => {
    await sd.pause();
    const pointer = sd.Pointer(arr, "target", "t");
    const math = new sd.Math(svg, "a_{even}")
        .opacity(0)
        .cy(arr.cy())
        .x(arr.mx() + 40)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    for (let i = 1; i <= count; i++) {
        await sd.pause();
        math.startAnimate().transformMath("a_{odd}").endAnimate();
        await sd.pause();
        for (let i = 1; i <= n; i++) {
            if (arr.color(i).fill === C.white) {
                pointer.startAnimate().moveTo(i).endAnimate();
                arr.startAnimate().color(i, C.orange).endAnimate();
                break;
            }
        }
        await sd.pause();
        pointer.startAnimate().moveTo(null).endAnimate();
        await sd.pause();
        math.startAnimate().transformMath("a_{even}").endAnimate();
    }
});

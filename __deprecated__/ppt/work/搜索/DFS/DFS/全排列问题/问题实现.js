import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const d = 5;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Brace(arr)
        .brace(1, d - 1)
        .value("d-1个确定的元素");
    sd.Pointer(arr, "当前正在枚举的元素", "t").moveTo(d);
    arr.color(1, d - 1, C.grey);
    arr.color(d, C.orange);
    arr.text(d, " ");
});

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        arr.startAnimate().text(d, i).endAnimate();
    }
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const arr = new sd.Array(svg).resize(n * 2).start(1);

sd.init(() => {
    sd.Brace(arr).brace(1, n * 2, "b").value("2n");
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().value(1, "A").endAnimate();

    const B = new sd.Text(arr, "B").opacity(0);
    const p = sd.Pointer(arr, "2i", "b", 5, 30, 5);
    for (let i = 2; i <= n * 2; i += 2) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        if (i === 2) arr.startAnimate().value(i, B).endAnimate();
        else {
            arr.startAnimate();
            arr.element(i - 2).drop();
            arr.element(i).valueFromExist(B);
            arr.endAnimate();
        }
    }
})
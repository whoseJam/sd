import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).start(1);

sd.init(() => {
    arr.resize(n);
});

sd.main(async () => {
    await sd.pause();
    const p = sd.Pointer(arr, "i", "b", 3, 20);
    p.startAnimate().moveTo(n).endAnimate();
    const b = sd.Brace(arr);
    b.startAnimate().brace(1, n, "b", 3).value(new sd.Math(b, "a_1+a_2+...+a_i\\equiv j").fontSize(15)).endAnimate();

    await sd.pause();
    const p1 = sd.Pointer(arr, "i+1", "b", 3, 20);
    const math = new sd.Math(svg, "?");
    arr.startAnimate();
    arr.push();
    arr.lastElement().value(math, R.center());
    p1.moveTo(n + 1);
    arr.endAnimate();
    for (let i = 1; i <= 9; i++) {
        await sd.pause();
        math.startAnimate().text(String(i)).endAnimate();
    }
    await sd.pause();
    math.startAnimate().text("k").endAnimate();
});

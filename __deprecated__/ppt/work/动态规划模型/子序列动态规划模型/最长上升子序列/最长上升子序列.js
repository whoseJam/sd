import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.BarArray(svg).x(100).y(300);
const dp = new sd.Array(svg);
const data = [1, 2, 4, 1, 3, 5];

sd.init(() => {
    arr.pushArray(data);
    dp.resize(data.length).x(arr.x()).y(arr.my());
    sd.Label(dp, "f");
});

sd.main(async () => {
    await sd.pause();
    const pi = sd.Pointer(arr, "i", "b", 3, 20, 3);
    const pj = sd.Pointer(arr, "j", "b", 3, 20, 3);

    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        pi.startAnimate().moveTo(i).endAnimate();
        arr.startAnimate().color(i, C.orange).endAnimate();
        dp.startAnimate().text(i, 1).endAnimate();

        for (let j = 0; j < i; j++) {
            if (data[j] >= data[i]) continue;
            await sd.pause();
            pj.startAnimate().moveTo(j).endAnimate();

            await sd.pause();
            const link = sd.Link(dp.element(j), dp.element(i), sd.Curve, "cx", "my", "cx", "my").bending(0.5).startAnimate().pointStoT().endAnimate().arrow();
            const nw = Math.max(Number(dp.value(j).text()) + 1, Number(dp.value(i).text()));
            dp.startAnimate().text(i, nw).endAnimate();
            await sd.pause();
            link.startAnimate().fadeStoT().endAnimate().remove();
        }
        await sd.pause();
        pj.startAnimate().opacity(0).endAnimate();
        arr.startAnimate().color(i, C.blue).endAnimate();
    }
});

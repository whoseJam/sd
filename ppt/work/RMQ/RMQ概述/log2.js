import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const log2 = new sd.Array(svg).resize(n).start(1);

sd.Label(log2, "$log_2$");
sd.Index(log2);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    log2.startAnimate().value(1, 0).endAnimate();

    for (let i = 2; i <= n; i++) {
        await sd.pause();
        const curve = sd
            .Link(log2.element(i >> 1), log2.element(i), sd.Curve, "cx", "my", "cx", "my")
            .bending(0.5)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        log2.startAnimate()
            .value(i, log2.intValue(i >> 1) + 1)
            .endAnimate();
        await sd.pause();
        curve.startAnimate().fadeStoT().endAnimate().arrow(null).remove();
    }
});

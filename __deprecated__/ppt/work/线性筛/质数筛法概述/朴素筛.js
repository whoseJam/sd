import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 20;
const arr = new sd.Array(svg).start(2).resize(n - 1);

sd.init(() => {
    arr.cx(600).cy(300);
    for (let i = 2; i <= n; i++) {
        arr.value(i, i);
        const e = arr.element(i);
        const stk = new sd.Stack(e);
        stk.elementWidth(20).elementHeight(20);
        e.childAs("stk", stk, R.aside("bc"));
    }
});

sd.main(async () => {
    const cur = sd.Pointer(arr, "cur");
    const kcur = sd.Pointer(arr, "kcur");
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        cur.startAnimate().moveTo(i).endAnimate();
        for (let j = 2; i * j <= n; j++) {
            await sd.pause();
            kcur.startAnimate()
                .moveTo(i * j)
                .endAnimate();
            const notPrime = arr.element(i * j);
            const stk = notPrime.child("stk");
            const size = stk.length();
            stk.startAnimate().push().color(size, C.blue).endAnimate();
        }
        await sd.pause();
        kcur.startAnimate().moveTo(null).endAnimate();
    }
});

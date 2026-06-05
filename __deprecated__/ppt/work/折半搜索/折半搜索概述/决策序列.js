import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 10;
const oarr = new sd.Array(svg).resize(n);
const narr = new sd.Array(svg).resize(n).y(oarr.my() + 40);
sd.Label(oarr, "决策可能性");
sd.Label(narr, "决策序列");

sd.init(() => {
    const b = new sd.BraceCurve(svg);
    b.source(oarr.x(), oarr.y() - 5).target(oarr.mx(), oarr.y() - 5).value("n", R.pointAtPathByRate(0.5, "cx", "my"))
    for (let i = 0; i < n; i++) {
        narr.value(i, "0");
        let tmp = 0;
        narr.element(i).onClick(() => {
            tmp ^= 1;
            narr.value(i).text(tmp);
        }); 
    }
    narr.opacity(0);
})

sd.main(async () => {
    await sd.pause();
    oarr.startAnimate().freeze();
    for (let i = 0; i < n; i++)
        oarr.value(i, "0/1");
    oarr.unfreeze().endAnimate();

    await sd.pause();
    narr.startAnimate().opacity(1).endAnimate();
})
import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [0, 5, 2, 4, 8, 6, 4, 1, 7, 5, 6, 1];
const arr = new sd.BarArray(svg);

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        arr.push(data[i]);
        arr.element(i).onClick(() => {
            sd.inter(async () => {
                const nextColor = arr.element(i).color().main === C.blue ? C.white : C.blue;
                arr.startAnimate().color(i, nextColor).endAnimate();
            });
        });
        arr.element(i).onDblClick(() => {
            sd.inter(async () => {
                const nextColor = arr.element(i).color().main === C.red ? C.white : C.red;
                arr.startAnimate().color(i, nextColor).endAnimate();
            });
        });
    }
});

sd.main(async () => {
    await sd.pause();
    sd.MathLabel(arr.element(8), "i", "bc").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    const brace = sd.WithBrace(arr);
    brace.brace(3, 8, "b", 40).startAnimate().pointStoT().value(new sd.Math(svg, "[i-t,i]"), R.pointAtPathByRate(0.5, "cx", "y")).endAnimate();
    await sd.pause();
    sd.MathLabel(arr.element(3), "j_1", "bc").opacity(0).startAnimate().opacity(1).endAnimate();
    sd.MathLabel(arr.element(5), "j_2", "bc").opacity(0).startAnimate().opacity(1).endAnimate();
});

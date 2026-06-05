import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [1, 3, 2, 5, 3, 5, 3, 4, 6, 3, 4, 1];
const a = new sd.Array(svg).pushArray(data);
const d = new sd.Array(svg).dy(80);
const r1 = new sd.Rect(svg).fillOpacity(0).stroke(C.red).strokeWidth(3).opacity(0);
const r2 = new sd.Rect(svg).fillOpacity(0).stroke(C.red).strokeWidth(3).opacity(0);

sd.init(() => {
    sd.Label(a, "a");
    sd.Label(d, "d");
});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        if (i === 0) {
            r1.startAnimate().opacity(1).endAnimate();
            d.startAnimate().push(data[0]).endAnimate();
        } else if (i === 1) {
            r1.startAnimate().dx(40).endAnimate();
            r2.startAnimate().opacity(1).endAnimate();
            d.startAnimate()
                .push(data[i] - data[i - 1])
                .endAnimate();
        } else {
            r1.startAnimate().dx(40).endAnimate();
            r2.startAnimate().dx(40).endAnimate();
            d.startAnimate()
                .push(data[i] - data[i - 1])
                .endAnimate();
        }
    }
});

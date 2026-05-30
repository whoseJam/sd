import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const [ql, qr] = [0, 8];
const data = [2, 5, 4, 1, 2, 3, 6, 2, 4, 1, 4, 1, 5];
const bar = new sd.BarArray(svg);
const arr = new sd.Array(svg).pushArray(data);

sd.init(() => {
    bar.my(arr.y()).elementHeight(20);
});

sd.main(async () => {
    function findRight(x) {
        const S = new Set();
        for (let i = x; i < data.length; i++) {
            if (S.has(data[i])) return i - 1;
            S.add(data[i]);
        }
        return data.length - 1;
    }
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        const Fl = findRight(i);
        sd.Brace(arr, "b")
            .braceGap(i * 10 + 10)
            .bending(3)
            .startAnimate()
            .brace(i, Fl)
            .endAnimate();
        arr.startAnimate().color(i, Fl, C.green).endAnimate();
        bar.startAnimate().push(Fl).endAnimate();
        await sd.pause();
        arr.startAnimate().color(C.white).endAnimate();
    }
    await sd.pause();
    sd.Focus(arr).startAnimate().focus(ql, qr).endAnimate();
    await sd.pause();
    let at;
    arr.startAnimate();
    for (let i = ql; i <= qr; i++) {
        if (findRight(i) <= qr) {
            at = i;
            arr.color(i, C.green);
        } else arr.color(i, C.blue);
    }
    arr.endAnimate();
    await sd.pause();
    sd.Brace(bar, "t").startAnimate().brace(ql, at).value("$max\\{F_i-i\\}+1$").endAnimate();
    sd.Brace(bar, "t")
        .startAnimate()
        .brace(at + 1, qr)
        .value("$R-min\\{i\\}+1$")
        .endAnimate();
});

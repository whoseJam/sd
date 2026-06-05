import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = "awkdklsafiewla";
const arr = new sd.Array(svg);

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    for (let i = 1; i <= 6; i++) {
        let l = sd.rand(0, arr.length() - 1);
        let r = sd.rand(0, arr.length() - 1);
        if (l > r) {
            let tmp = l;
            l = r;
            r = tmp;
        }
        await sd.pause();
        arr.startAnimate().color(l, r, C.green).endAnimate();
        await sd.pause();
        arr.startAnimate().color(l, r, C.white).endAnimate();
    }
});

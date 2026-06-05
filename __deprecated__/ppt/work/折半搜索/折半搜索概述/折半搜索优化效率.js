import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 5;
const arr1 = new sd.Array(svg).resize(n);
const arr2 = new sd.Array(svg).resize(n);

sd.init(() => {
    arr2.x(arr1.mx());
});

sd.main(async () => {
    await sd.pause();
    arr1.startAnimate().dx(-20).endAnimate();
    arr2.startAnimate().dx(20).endAnimate();
    await sd.pause();
    const b1 = new sd.BraceCurve(svg);
    const b2 = new sd.BraceCurve(svg);
    function brace(b, arr, text) {
        b.source(arr.mx(), arr.my() + 5)
            .target(arr.x(), arr.my() + 5)
            .value(text, R.pointAtPathByRate(0.5, "cx", "y"));
        b.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    brace(b1, arr1, new sd.Math(b1, "Dfs(1-5),O(2^5)"));
    brace(b2, arr2, new sd.Math(b2, "Dfs(6-10),O(2^5)"));
});

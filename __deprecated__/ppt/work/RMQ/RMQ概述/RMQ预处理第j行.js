import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const m = Math.floor(Math.log2(n)) + 1;
const data = [0, 2, 4, 3, 7, 4, 6, 8, 3, 1, 5];
const arr = new sd.Array(svg).start(1);
const st = new sd.Grid(svg).n(m).m(n).startM(1);

sd.init(() => {
    arr.pushArray(data.slice(1));
    st.x(arr.mx() + 60).y(arr.y());
    sd.Index(arr, "t");
    sd.Label(st, "F数组", "tc");
    for (let i = 1; i <= n; i++) {
        sd.Label(st.element(m - 1, i), i, "bc", 20, 3);
    }
    for (let i = 0; i < m; i++) {
        sd.Label(st.element(m - 1 - i, 1), `$2^${i}$`, "lc", 20);
    }
    for (let i = 1; i <= n; i++) {
        st.value(m - 1, i, data[i]);
    }
});

sd.main(async () => {
    for (let j = 1; j <= m; j++) for (let i = 1; i <= n; i++) await show(i, j);
});

async function show(pos, i) {
    if (pos + (1 << i) - 1 <= n) {
        await sd.pause();
        let l = pos,
            r = (1 << i) + pos - 1;
        arr.startAnimate();
        for (let j = l; j <= r; j++) arr.color(j, C.green);
        arr.endAnimate();

        await sd.pause();

        const arr1 = new sd.Array(svg).pushArray(data.slice(l, l + (1 << (i - 1))));
        const arr2 = new sd.Array(svg).pushArray(data.slice(l + (1 << (i - 1)), r + 1));
        const cx = (arr.element(l).x() + arr.element(r).mx()) / 2;
        arr1.mx(cx - 20)
            .y(100)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        arr2.x(cx + 20)
            .y(100)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        const l1 = sd
            .Link(arr.element(l + (1 << (i - 1)) - 1), arr1, sd.Line, "mx", "cy")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        const l2 = sd
            .Link(arr.element(l + (1 << (i - 1))), arr2, sd.Line, "x", "cy")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();

        await sd.pause();

        arr1.startAnimate().color(C.orange).endAnimate();
        arr2.startAnimate().color(C.blue).endAnimate();
        st.startAnimate();
        st.color(m - i, pos, C.orange);
        st.color(m - i, pos + (1 << (i - 1)), C.blue);
        st.endAnimate();

        await sd.pause();
        arr1.startAnimate().opacity(0).remove();
        arr2.startAnimate().opacity(0).remove();

        let mx = -Infinity;
        for (let j = l; j <= r; j++) mx = Math.max(mx, data[j]);
        st.startAnimate()
            .value(m - i - 1, pos, mx)
            .endAnimate();
        await sd.pause();
        arr.startAnimate();
        for (let j = l; j <= r; j++) arr.color(j, C.white);
        arr.endAnimate();
        st.startAnimate();
        st.color(m - i, pos, C.white);
        st.color(m - i, pos + (1 << (i - 1)), C.white);
        st.endAnimate();
    }
}

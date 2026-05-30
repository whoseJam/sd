import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = Math.floor(Math.log2(n)) + 1;
const data = [0, 2, 4, 3, 7, 4];
const arr = new sd.Array(svg).start(1).x(100).y(100);
const st = new sd.Grid(svg).n(m).m(n).startM(1).x(100).y(200);

sd.init(() => {
    arr.pushArray(data.slice(1));
    sd.Index(arr, "t");
    sd.Label(st, "F数组", "tc");
    for (let i = 1; i <= n; i++) {
        sd.Label(st.element(m - 1, i), i, "bc", 20, 3);
    }
    for (let i = 0; i < m; i++) {
        sd.Label(st.element(m - 1 - i, 1), `$2^${i}$`, "lc", 20);
    }
});

sd.main(async () => {
    st.opacity(0);
    await sd.pause();
    st.startAnimate().opacity(1).endAnimate();
    for (let i = 1; i <= n; i++) await show(i, 0);
});

async function show(pos, i) {
    if (pos + (1 << i) - 1 <= n) {
        await sd.pause();
        let l = pos,
            r = (1 << i) + pos - 1;
        arr.startAnimate();
        for (let j = l; j <= r; j++) arr.color(j, C.orange);
        arr.endAnimate();
        let rct = new sd.Rect(svg).strokeWidth(3).stroke(C.red);
        rct.x(arr.element(l).x()).y(arr.element(l).y());
        rct.width(arr.elementWidth() * (r - l + 1));
        rct.height(arr.elementHeight());
        rct.opacity(0).fillOpacity(0);
        rct.startAnimate().opacity(1).endAnimate();
        rct.startAnimate();
        {
            let elem = st.element(m - i - 1, pos);
            rct.x(elem.x()).y(elem.y());
            rct.width(elem.width());
            rct.height(elem.height());
        }
        rct.endAnimate();
        let mx = -Infinity;
        for (let j = l; j <= r; j++) mx = Math.max(mx, data[j]);
        st.startAnimate();
        st.color(m - i - 1, pos, C.orange);
        st.value(m - i - 1, pos, mx);
        st.endAnimate();
        await sd.pause();
        arr.startAnimate();
        for (let j = l; j <= r; j++) arr.color(j, C.white);
        arr.endAnimate();
        st.startAnimate();
        st.color(m - i - 1, pos, C.white);
        st.endAnimate();
        rct.startAnimate().opacity(0).remove();
    }
}

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
    st.x(arr.mx() + 60).cy(arr.cy());
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
    for (let j = 0; j <= 3; j++) for (let i = 1; i <= n; i++) await show(i, j);

    await query(2, 7);
    await query(3, 10);
});

async function query(l, r) {
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) arr.color(i, C.green);
    arr.endAnimate();
    let k = Math.floor(Math.log2(r - l + 1)),
        a1,
        a2;
    {
        await sd.pause();
        let L = l,
            R = l + (1 << k) - 1;
        a1 = new sd.Array(svg);
        let rct = new sd.Rect(svg).strokeWidth(3).stroke(C.red);
        rct.fillOpacity(0).x(arr.element(L).x()).y(arr.element(L).y());
        rct.width(arr.elementWidth() * (R - L + 1));
        rct.height(arr.elementHeight());
        rct.opacity(0).startAnimate().opacity(1).endAnimate();
        for (let i = L; i <= R; i++) a1.push(data[i]);
        a1.color(C.green).x(rct.x()).y(rct.y());
        a1.after(rct).startAnimate().dy(50).endAnimate();
        rct.startAnimate().opacity(0).remove();
    }
    {
        await sd.pause();
        let L = r - (1 << k) + 1,
            R = r;
        a2 = new sd.Array(svg);
        let rct = new sd.Rect(svg).strokeWidth(3).stroke(C.red);
        rct.fillOpacity(0).x(arr.element(L).x()).y(arr.element(L).y());
        rct.width(arr.elementWidth() * (R - L + 1));
        rct.height(arr.elementHeight());
        rct.opacity(0).startAnimate().opacity(1).endAnimate();
        for (let i = L; i <= R; i++) a2.push(data[i]);
        a2.color(C.green).x(rct.x()).y(rct.y());
        a2.after(rct).startAnimate().dy(100).endAnimate();
        rct.startAnimate().opacity(0).remove();
    }
    await sd.pause();
    a1.startAnimate().color(C.orange).endAnimate();
    st.startAnimate()
        .color(m - 1 - k, l, C.orange)
        .endAnimate();
    await sd.pause();
    a2.startAnimate().color(C.blue).endAnimate();
    st.startAnimate()
        .color(m - 1 - k, r - (1 << k) + 1, C.blue)
        .endAnimate();
    await sd.pause();
    a1.startAnimate().opacity(0).remove();
    a2.startAnimate().opacity(0).remove();
    arr.startAnimate().color(C.white).endAnimate();
    st.startAnimate();
    st.color(m - 1 - k, l, C.white);
    st.color(m - 1 - k, r - (1 << k) + 1, C.white).endAnimate();
    st.endAnimate();
}

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
        let mx = -Infinity;
        for (let j = l; j <= r; j++) mx = Math.max(mx, data[j]);
        rct.endAnimate();
        st.startAnimate();
        st.value(m - i - 1, pos, mx);
        st.color(m - i - 1, pos, C.orange);
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

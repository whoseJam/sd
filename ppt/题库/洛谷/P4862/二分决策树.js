import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Index(arr, "t");
    function dfs(lastVertex, l, r, depth, eqcnt, type) {
        const mid = (l + r) >> 1;
        const vertex = new sd.Rect(svg).width((mid - l + 1) * 40).height(10).x(arr.element(l).x()).y(depth * 70 + 60);
        if (lastVertex) sd.Link(lastVertex, vertex).arrow().value(type, R.pointAtPathByRate(0.5, type === "+a" ? "mx" : "x", "cy"));
        if (l === r) {
            if (eqcnt === 0) eqcnt++;
            else return;
            return;
        }
        if (l <= mid) dfs(vertex, l, mid, depth + 1, 0, "+a");
        if (mid + 1 <= r) dfs(vertex, mid + 1, r, depth + 1, 0, "+b");
    }
    dfs(0, 1, n, 0, 0);
})

sd.main(async () => {
    
})
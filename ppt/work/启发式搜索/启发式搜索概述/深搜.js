import * as sd from "@/sd";

const svg = sd.svg();
const n = 4;

sd.init(() => {
    BuildSearchGraph(n);
})

sd.main(async () => {

})

function BuildSearchGraph(n) {
    const h = 20 * Math.sqrt(3);
    const rows = [[]];
    for (let i = 1; i <= n; i++) {
        const row = [0], l = 1, r = i * 2 - 1, mid = (l + r) >> 1;
        for (let j = l; j <= r; j++) {
            const clazz = (j&1) ? sd.Triangle : sd.InvertedTriangle;
            const dis = j - mid;
            row.push(new clazz(svg).y(h * i).cx(dis * 20));
        }
        rows.push(row);
    }
    return rows;
}
import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg);
const data = [15, 2, 18, 12, 13, 4];

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    await sd.pause();
    dfs(0, data.length - 1, 0);
});

function dfs(l, r, depth, father = undefined) {
    let mn = Infinity;
    for (let i = l; i <= r; i++) mn = Math.min(mn, data[i]);

    for (let i = l; i <= r; i++) {
        if (data[i] === mn) {
            const box = new sd.Box(svg).center(arr.element(i).center()).value(data[i]);
            box.after(depth * 300)
                .startAnimate()
                .dy(60 + depth * 70)
                .endAnimate();
            if (father) {
                sd.Link(father, box)
                    .opacity(0)
                    .after(depth * 300 + 300)
                    .opacity(1)
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
            }
            if (l <= i - 1) dfs(l, i - 1, depth + 1, box);
            if (i + 1 <= r) dfs(i + 1, r, depth + 1, box);
        }
    }
}

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 12;
const m = 3;
const arrs = [];

let interacting = false;

sd.init(() => {
    for (let i = 1; i <= m; i++) {
        arrs.push(new sd.Array(svg).y(i * 80).resize(n).start(1));
        sd.Label(arrs[i - 1], `j=${i}`);
        if (i === 1) continue;
        for (let j = 1; j <= n; j++) {
            arrs[i - 1].element(j).onClick(() => {
                if (interacting) return;
                link(i, j);
            })
        }
    }
    sd.Index(arrs[0], "t");
    for (let j = 1; j <= n; j++) {
        arrs[0].element(j).onClick(() => {
            if (interacting) return;
            column(j);
        })
    }
})

sd.main(async () => {
})

async function link(i, j) {
    arrs[i - 1].startAnimate().color(j, C.blue).endAnimate();
    await sd.pause();
    const links = [];
    arrs[i - 2].startAnimate().color(1, j - 1, C.green).endAnimate();
    for (let j1 = 1; j1 < j; j1++) {
        links.push(sd.Link(arrs[i - 2].element(j1), arrs[i - 1].element(j), sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow());
    }
    await sd.pause();
    links.forEach(link => link.startAnimate().opacity(0).endAnimate());
    arrs[i - 1].startAnimate().color(j, C.white).endAnimate();
    arrs[i - 2].startAnimate().color(1, j - 1, C.white).endAnimate();
    interacting = false;
}

async function column(j) {
    await sd.pause();
    for (let i = 1; i <= m; i++)
        arrs[i - 1].startAnimate().color(j, C.red).endAnimate();
    await sd.pause();
    for (let i = 1; i <= m; i++)
        arrs[i - 1].startAnimate().color(j, C.white).endAnimate();
    interacting = false;
}
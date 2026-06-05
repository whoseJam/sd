import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.DAG(svg).width(100).height(100).rankDir("LR");
const Q = new sd.Array(svg)
    .elementWidth(100)
    .x(300)
    .cy(100 / 3 - 10);
const q = new sd.Array(svg)
    .elementWidth(100)
    .x(300)
    .cy(200 / 3 + 10);
const links = [5, 2, 3];
sd.Label(Q, "queue");

sd.init(() => {
    graph.link(1, 2).element(1, 2).value(1, R.pointAtPathByRate(0.5, "cx", "my"));
    graph.link(1, 3).element(1, 3).value(1, R.pointAtPathByRate(0.5, "cx", "my"));
    graph.link(1, 4).element(1, 4).value(1, R.pointAtPathByRate(0.5, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    for (let i = 2; i <= 4; i++) {
        Q.startAnimate().push(`$dis_${i}=1$`).endAnimate();
    }
    await sd.pause();
    graph.startAnimate();
    for (let i = 2; i <= 4; i++) {
        graph.text(1, i, links[i - 2]);
    }
    graph.endAnimate();
    await sd.pause();
    const lb = sd.Label(q, "new queue").opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 2; i <= 4; i++) {
        q.startAnimate()
            .push(`$dis_${i}=${links[i - 2]}$`)
            .endAnimate();
        q.lastElement().dis = links[i - 2];
    }
    await sd.pause();
    lb.startAnimate().text("priority queue").endAnimate();
    await sd.pause();
    q.startAnimate()
        .sort((a, b) => {
            return a.dis - b.dis;
        })
        .endAnimate();
});

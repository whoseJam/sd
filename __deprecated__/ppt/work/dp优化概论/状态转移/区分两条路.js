import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).m(5).width(400).height(120);

sd.init(() => {
    for (let i = 0; i <= 5; i++) {
        graph.at(0, i).newNode(i + 1);
    }
    graph.at(1, 2.5).newNode(7);
})

sd.main(async () => {
    async function focus(d, checker, duration) {
        await sd.pause();
        const links = [];
        for (let i = 0; i < 6; i++) {
            if (checker(i)) links.push(sd.Link(graph.element(i + 1), graph.element(d + 1)).startAnimate(duration).pointStoT().endAnimate().arrow());
            else links.push(undefined);
        }
        await sd.pause();
        for (let i = 0; i < 6; i++) {
            if (checker(i)) links[i].startAnimate().opacity(0).endAnimate();
        }
    }
    await focus(6, () => true, 500);
    await focus(6, (i) => (i % 2 === 0), 500);
    await focus(6, () => true, 100);
})
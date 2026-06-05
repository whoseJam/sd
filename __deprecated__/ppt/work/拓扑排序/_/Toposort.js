import * as sd from "@/sd";

/**
 * @param {sd.GraphBase} graph
 * @param {number} Qgap
 */
export async function toposort(graph, Qgap, callback) {
    const C = sd.color();
    const R = sd.rule();
    let maxIndgree = 0;
    const nodes = graph.nodes();
    const links = graph.links();
    nodes.forEach(node => {
        node.ind = 0;
    });
    links.forEach(link => {
        graph.findNodeById(graph.targetId(link)).ind++;
    });
    const Q = new sd.Array(graph);
    const SEQ = new sd.Array(graph);
    maxIndgree = Math.max.apply(
        null,
        nodes.map(node => node.ind)
    );
    const grad = C.gradient(C.white, C.orange, 0, maxIndgree);
    nodes.forEach(node => {
        node.color(grad(node.ind));
    });

    graph.childAs("Q", Q, R.aside("bl", Qgap));
    sd.Label(Q, "Q队列", "lc");
    Q.childAs("SEQ", SEQ, R.aside("bl", 10));
    sd.Label(SEQ, "拓扑序", "lc");

    await sd.pause();
    Q.startAnimate();
    nodes.forEach(node => {
        if (node.ind === 0) {
            Q.push(graph.nodeId(node));
        }
    });
    Q.endAnimate();

    while (Q.length() > 0) {
        await sd.pause();
        const u = Q.firstElement().value().text();
        Q.startAnimate().color(0, C.blue).endAnimate();
        graph.startAnimate().color(u, C.blue).endAnimate();
        const outLinks = graph.outLinks(u);
        for (let i = 0; i < outLinks.length; i++) {
            const link = outLinks[i];
            if (callback) {
                await callback(link);
            }
            await sd.pause();
            const toId = graph.toNodeId(link, u);
            const v = graph.findNodeById(toId);
            link.startAnimate().strokeDashArray([5, 5]).stroke(C.grey).endAnimate();
            v.startAnimate().color(grad(--v.ind)).endAnimate();
            if (!v.ind) Q.startAnimate().push(toId).endAnimate();
        }
        await sd.pause();
        SEQ.startAnimate().push(u).endAnimate();
        Q.startAnimate().erase(0).endAnimate();
        graph.startAnimate().color(u, C.white).endAnimate();
    }
}

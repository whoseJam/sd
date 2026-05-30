import * as sd from "@/sd";

/**
 * @param {sd.BaseGraph} graph
 * @param {Array<{ from: number|string, to: number|string }>} path
 */
export async function flow(graph, path) {
    const svg = sd.svg();
    const C = sd.color();
    await sd.pause();
    let timestamp = 0;
    let bottleNeck = Infinity;
    const cloned = [];
    path.forEach(segment => {
        const link = graph.element(segment.from, segment.to);
        const clone = new sd.Line(svg).source(link.source()).target(link.target()).opacity(0);
        clone.after(timestamp).opacity(1).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate().arrow();
        timestamp = clone;
        bottleNeck = Math.min(bottleNeck, link.intValue());
        cloned.push(clone);
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`)
        .fontSize(25)
        .cx(graph.cx())
        .y(graph.my() + 40);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    timestamp = 0;
    path.forEach((segment, i) => {
        const link = graph.element(segment.from, segment.to);
        const linkValue = link.value();
        const remainCapacity = linkValue.intValue() - bottleNeck;
        linkValue.after(timestamp).startAnimate().transformMath(remainCapacity).endAnimate();
        if (link.intValue() === 0) link.after(timestamp).startAnimate().strokeDashArray([5, 5]).endAnimate();
        cloned[i].after(timestamp).startAnimate().fadeStoT().endAnimate().remove();
        timestamp = cloned[i];
    });
    text.startAnimate().opacity(0).remove();
}

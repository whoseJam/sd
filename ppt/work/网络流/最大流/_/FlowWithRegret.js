import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseGraph} graph
 * @param {Array<{ from: number|string, to: number|string }>} path
 * @param {{
 *  onReverseLink(u: number, v: number): (parent: sd.SDNode, child: sd.SDNode) => void
 *  textGap: number
 * }} args
 */
export async function flowWithRegret(graph, path, args) {
    const onReverseLink = args.onReverseLink;
    const textGap = args.textGap || 40;
    const svg = sd.svg();
    const C = sd.color();
    await sd.pause();
    let timestamp = 0;
    let bottleNeck = Infinity;
    const cloned = [];
    path.forEach(segment => {
        const link = graph.element(segment.from, segment.to);
        let clone = undefined;
        if (link instanceof sd.LineSVG) clone = new sd.Line(svg);
        else clone = new sd.Curve(svg);
        clone.source(link.source()).target(link.target()).opacity(0);
        clone.after(timestamp).opacity(1).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate().arrow();
        timestamp = clone;
        bottleNeck = Math.min(bottleNeck, link.intValue());
        cloned.push(clone);
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`)
        .fontSize(25)
        .cx(graph.cx())
        .y(graph.my() + textGap);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    path.forEach((segment, i) => {
        const link = graph.element(segment.from, segment.to);
        const linkValue = link.value();
        const remainCapacity = linkValue.intValue() - bottleNeck;
        linkValue.after(timestamp).startAnimate().transformMath(remainCapacity).endAnimate();
        if (link.intValue() === 0) link.after(timestamp).startAnimate().strokeDashArray([5, 5]).endAnimate();
        cloned[i].after(timestamp).startAnimate().fadeStoT().endAnimate().remove();
        timestamp = cloned[i];
    });
    await sd.pause();
    timestamp = 0;
    for (let i = path.length - 1; i >= 0; i--) {
        const segment = path[i];
        const link = graph.element(segment.from, segment.to);
        let reversedLink = graph.element(segment.to, segment.from);
        if (!reversedLink) {
            const rule = onReverseLink(segment.from, segment.to);
            graph.newLink(segment.to, segment.from);
            reversedLink = graph.element(segment.to, segment.from);
            reversedLink.stroke(C.deepSkyBlue).opacity(0).after(timestamp).opacity(1);
            reversedLink.startAnimate();
            reversedLink.value(new sd.Math(reversedLink, bottleNeck), rule);
            reversedLink.pointStoT();
            reversedLink.endAnimate();
            reversedLink.arrow();
        } else {
            const remainCapacity = reversedLink.intValue() + bottleNeck;
            reversedLink.value().after(timestamp).startAnimate().transformMath(remainCapacity).endAnimate();
            if (remainCapacity > 0) reversedLink.after(timestamp).startAnimate().strokeDashArray([5, 0]).endAnimate();
        }
        timestamp = reversedLink.value();
    }
    await sd.pause();
    text.startAnimate().opacity(0).remove();
}

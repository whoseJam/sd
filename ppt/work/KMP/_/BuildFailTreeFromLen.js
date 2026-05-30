import * as sd from "@/sd";

/**
 * @param {sd.Array} str
 * @param {Array<number>} len
 * @param {Array<{location: string, gap: number}>} locations
 * @param {{
 *  onCreateTree: (tree: sd.HorizontalValueTree) => void
 * }} args
 */
export async function buildFailTreeFromLen(str, len, locations, args) {
    const svg = sd.svg();
    const R = sd.rule();
    const EN = sd.enter();
    const onCreateTree = args.onCreateTree;

    await sd.pause();
    const links = [];
    for (let i = 1; i <= str.end(); i++) {
        const link = new sd.Curve(svg).bending(-0.5);
        link.source(str.element(len[i]).pos("cx", "y"));
        link.target(str.element(i).pos("cx", "y"));
        link.startAnimate().pointTtoS().endAnimate().revArrow();
        links.push({
            link: link,
            fa: len[i],
            u: i,
        });
    }

    await sd.pause();
    const tree = new sd.HorizontalValueTree(svg);
    if (onCreateTree) await onCreateTree(tree);

    sd.freeze();
    tree.startAnimate(2000);
    for (let i = str.start(); i <= str.end(); i++) {
        tree.newNodeFromExistElement(i, str.element(i));
        if (i > 0) {
            const link = links[i - 1];
            tree.newLinkFromExistElement(link.fa, link.u, link.link);
        }
    }
    sd.unfreeze();
    tree.uneffectAll();
    tree.forEachLink((link, sourceId, targetId) => {
        const source = tree.element(sourceId);
        const target = tree.element(targetId);
        link.bending(0);
        link.source(source.center());
        link.target(target.center());
        sd.trim(link, source, target);
    });
    tree.endAnimate();

    await sd.pause();
    let currentStr = "";
    for (let i = str.start(); i <= str.end(); i++) {
        if (i >= 1) {
            currentStr = currentStr + str.text(i);
            const element = str.element(i);
            element.startAnimate();
            element.childAs(new sd.Text(svg, currentStr).onEnter(EN.appear()), R.aside(locations[i].location, locations[i].gap));
            element.endAnimate();
        }
    }
}

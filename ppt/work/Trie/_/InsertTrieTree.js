import * as sd from "@/sd";

const R = sd.rule();

/**
 * @param {sd.BaseTree} tree
 * @param {string} str
 * @param {{
 *  onMoveU: (u: number) => void;
 *  onInsertI: (i: number) => void;
 *  onReachEndOfString: (u: number) => void;
 * }} args
 */
export async function insertTrieTree(tree, str, args) {
    const onMoveU = args.onMoveU;
    const onInsertI = args.onInsertI;
    const onReachEndOfString = args.onReachEndOfString;

    let u = 1;
    if (onMoveU) await onMoveU(1);
    for (let i = 0; i < str.length; i++) {
        if (onInsertI) await onInsertI(i);
        let c = str[i];
        const du = tree.element(u);
        if (!du.acch) du.acch = {};
        if (!du.acch[c]) {
            const id = tree.nodes().length + 1;
            du.acch[c] = id;
            await sd.pause();
            tree.startAnimate();
            tree.link(u, id);
            tree.element(u, id).after(0).arrow().value(c, R.pointAtPathByRate(0.5, "mx", "cy"));
            tree.endAnimate();
            tree.element(id).acch = {};
        }
        u = du.acch[c];
        if (onMoveU) await onMoveU(u);
    }
    if (onReachEndOfString) await onReachEndOfString(u);
}

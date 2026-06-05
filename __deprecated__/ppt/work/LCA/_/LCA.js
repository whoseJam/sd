import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseTree} tree
 * @param {number|string} x
 * @param {number|string} y
 * @param {{
 *  onLCA: (x: string, y: string) => void;
 *  onCheckJump: (x: string, kth: string) => void;
 *  onJump: (x: string, kth: string) => void;
 *  onCheckJumpTogether: (x: string, kx: string, y: string, ky: string) => void;
 *  onJumpTogether: (x: string, kx: string, y: string, ky: string) => void;
 * }} args
 */
export async function LCA(tree, x, y, args) {
    const onLCA = args.onLCA;
    const onCheckJump = args.onCheckJump;
    const onJump = args.onJump;
    const onCheckJumpTogether = args.onCheckJumpTogether;
    const onJumpTogether = args.onJumpTogether;

    [x, y] = [String(x), String(y)];
    if (tree.depth(x) < tree.depth(y)) {
        let tmp = x;
        x = y;
        y = tmp;
    }

    if (onLCA) await onLCA(x, y);
    const lim = Math.log2(tree.depth());
    for (let i = lim; i >= 0; i--) {
        if (tree.depth(x) <= 1 << i) continue;
        const kth = tree.ancestorId(x, 1 << i);
        if (onCheckJump) await onCheckJump(x, kth);
        if (tree.depth(kth) >= tree.depth(y)) {
            if (onJump) await onJump(x, kth);
            x = kth;
        }
        if (tree.depth(x) === tree.depth(y)) break;
    }
    if (x === y) {
        return x;
    }

    for (let i = lim; i >= 0; i--) {
        if (tree.depth(x) <= 1 << i) continue;
        const kx = tree.ancestorId(x, 1 << i);
        const ky = tree.ancestorId(y, 1 << i);
        if (onCheckJumpTogether) await onCheckJumpTogether(x, kx, y, ky);
        if (kx !== ky) {
            if (onJumpTogether) await onJumpTogether(x, kx, y, ky);
            x = kx;
            y = ky;
        }
    }
    if (onJumpTogether) {
        await onJumpTogether(x, tree.fatherId(x), y, tree.fatherId(y));
    }
    return tree.fatherId(x);
}

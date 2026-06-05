import * as sd from "@/sd";

/**
 * @param {sd.Splay} tree
 * @param {number|string} x
 * @param {Array<number>} fa
 * @param {Array<[number, number]>} ch
 */
export async function rotate(tree, x, fa, ch) {
    const cutAnimations = [];
    const linkAnimations = [];
    const y = fa[x];
    const z = fa[y];
    const L = ch[y][0] === x ? 0 : 1;
    const R = L ^ 1;
    if (ch[z][0] === y) {
        const chz0 = ch[z][0];
        if (chz0) cutAnimations.push(() => tree.cut(z, chz0));
        if (z) linkAnimations.push(() => tree.leftChild(z, x));
        ch[z][0] = x;
    } else {
        const chz1 = ch[z][1];
        if (chz1) cutAnimations.push(() => tree.cut(z, chz1));
        if (z) linkAnimations.push(() => tree.rightChild(z, x));
        ch[z][1] = x;
    }
    cutAnimations.push(() => tree.cut(y, x));
    fa[x] = z;
    fa[y] = x;
    if (ch[x][R]) {
        const chxR = ch[x][R];
        cutAnimations.push(() => tree.cut(x, chxR));
        linkAnimations.push(() => tree.link(y, chxR, L));
        fa[ch[x][R]] = y;
    }
    ch[y][L] = ch[x][R];
    linkAnimations.push(() => tree.link(x, y, R));
    ch[x][R] = y;
    await sd.pause();
    tree.startAnimate().freeze();
    cutAnimations.forEach(animation => animation());
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    linkAnimations.forEach(animation => animation());
    tree.unfreeze().endAnimate();
}

/**
 * @param {sd.Splay}
 * @param {Array<number>} fa
 * @param {Array<[number, number]>} ch
 */
export async function findPrev(tree, fa, ch) {
    const focus = sd.Focus(tree);
    let x = tree.rootId();
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    x = ch[x][0];
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    while (ch[x][1]) {
        await sd.pause();
        focus
            .startAnimate()
            .focus((x = ch[x][1]))
            .endAnimate();
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
}

/**
 * @param {sd.Splay} tree
 * @param {Array<number>} fa
 * @param {Array<[number, number]>} ch
 * @returns {number|string}
 */
export function findPrevWithoutAnimation(tree, fa, ch) {
    let x = tree.rootId();
    x = ch[x][0];
    while (ch[x][1]) x = ch[x][1];
    return x;
}

/**
 * @param {sd.Splay} tree
 * @param {Array<number>} fa
 * @param {Array<[number, number]>} ch
 * @returns {number|string}
 */
export function findNextWithoutAnimation(tree, fa, ch) {
    let x = tree.rootId();
    x = ch[x][1];
    while (ch[x][0]) x = ch[x][0];
    return x;
}

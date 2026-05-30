/**
 *
 * @param {Array<{x: number, y: number}>} _nodes
 * @param {{
 *  onCheckSlope(i: number, cllst: number, clst: number, k1: number, k2: number): void;
 *  onAddConvex(i: number): void;
 *  onPopConvex(i: number): void;
 *  onStartAdd(i: number): void;
 *  onEndAdd(i: number): void;
 * }} args
 * @returns
 */
export async function buildConvex(_nodes, args = {}) {
    const onCheckSlope = args.onCheckSlope;
    const onAddConvex = args.onAddConvex;
    const onPopConvex = args.onPopConvex;
    const onStartAdd = args.onStartAdd;
    const onEndAdd = args.onEndAdd;
    const nodes = _nodes.map((node, id) => {
        return { x: node.x, y: node.y, id: id };
    });
    function slope(i, j) {
        return (nodes[i].y - nodes[j].y) / (nodes[i].x - nodes[j].x);
    }
    nodes.sort((a, b) => a.x - b.x);
    const convex = [];

    if (onStartAdd) await onStartAdd(id(0));
    if (onAddConvex) await onAddConvex(id(0));
    convex.push(0);
    if (onEndAdd) await onEndAdd(id(0));

    for (let i = 1; i < nodes.length; i++) {
        if (onStartAdd) await onStartAdd(id(i));
        while (convex.length >= 2) {
            const k1 = slope(i, convex[convex.length - 1]);
            const k2 = slope(convex[convex.length - 1], convex[convex.length - 2]);
            if (onCheckSlope) await onCheckSlope(id(i), id(convex[convex.length - 2]), id(convex[convex.length - 1]), k1, k2);
            if (k2 <= k1) {
                break;
            } else {
                if (onPopConvex) await onPopConvex(id(convex[convex.length - 1]));
                convex.pop();
            }
        }
        if (onAddConvex) await onAddConvex(id(i));
        convex.push(i);
        if (onEndAdd) await onEndAdd(id(i));
    }
    function id(v) {
        return nodes[v].id;
    }
    console.log(nodes);
    console.log(convex);
    return convex.map(v => id(v));
}

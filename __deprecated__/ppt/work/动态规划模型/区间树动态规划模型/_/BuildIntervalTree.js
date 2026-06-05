import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseArary} arr
 * @param {Array<[number, number]>} intervals
 * @param {{
 *  onCreateNode: (l: number, r: number, fa: sd.SDNode, cx: number, y: number) => sd.SDNode | Promise<sd.SDNode>;
 *  layerHeight: number;
 *  initalLayerHeight: number;
 * }} args
 */
export async function buildIntervalTree(arr, intervals, args) {
    const onCreateNode = args.onCreateNode;
    const layerHeight = args.layerHeight ? args.layerHeight : 60;
    const initalLayerHeight = args.initalLayerHeight ? args.initalLayerHeight : layerHeight;

    const fa = sd.make1d(arr.length(), 0);
    function id(i) {
        return i - arr.start();
    }
    intervals.sort((a, b) => {
        if (a[1] - a[0] != b[1] - b[0]) return b[1] - b[0] - (a[1] - a[0]);
        return a[0] - b[0];
    });
    for (let i = 0; i < intervals.length; i++) {
        const l = intervals[i][0];
        const r = intervals[i][1];
        if (onCreateNode) {
            const cx = (arr.element(l).cx() + arr.element(r).cx()) / 2;
            const y = fa[id(l)] ? fa[id(l)].y() + layerHeight : arr.my() + initalLayerHeight;
            const node = await onCreateNode(l, r, fa[id(l)], cx, y);
            for (let j = l; j <= r; j++) fa[id(j)] = node;
        }
    }
}

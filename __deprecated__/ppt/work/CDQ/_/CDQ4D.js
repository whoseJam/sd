import * as sd from "@/sd";

/**
 * @param {sd.BaseArray} arr
 * @param {{
 *  onCheckALessThanB: (a: sd.SDNode, b: sd.SDNode) => boolean;
 *  onMoveI: (i: number) => void;
 *  onMoveJ: (j: number) => void;
 *  onStartMerge1: (l: number, r: number) => void;
 *  onEndMerge1: (l: number, r: number) => void;
 *  onStartMerge2: (l: number, r: number) => void;
 *  onEndMerge2: (l: number, r: number) => void;
 *  onSortDim1: () => void;
 *  onSortDim2: (l: number, r: number) => void;
 *  onSortDim3: (l: number, r: number) => void;
 *  onInsert: (j: number) => void;
 *  onQuery: (i: number) => void;
 * }} args
 */
export async function CDQ4D(arr, args) {
    const onCheckALessThanB = args.onCheckALessThanB;
    const onMoveI = args.onMoveI;
    const onMoveJ = args.onMoveJ;
    const onStartMerge1 = args.onStartMerge1;
    const onEndMerge1 = args.onEndMerge1;
    const onStartMerge2 = args.onStartMerge2;
    const onEndMerge2 = args.onEndMerge2;
    const onSortDim1 = args.onSortDim1;
    const onSortDim2 = args.onSortDim2;
    const onSortDim3 = args.onSortDim3;
    const onInsert = args.onInsert;
    const onQuery = args.onQuery;

    async function CDQ2(l, r) {
        if (l === r) return;
        const mid = (l + r) >> 1;
        await CDQ2(l, mid);
        await CDQ2(mid + 1, r);

        if (onStartMerge2) await onStartMerge2(l, r);
        let j = l - 1;
        for (let i = mid + 1; i <= r; i++) {
            if (onMoveI) await onMoveI(i);
            while (j + 1 <= mid && (await onCheckALessThanB(arr.element(j + 1), arr.element(i)))) {
                j++;
                if (onMoveJ) await onMoveJ(j);
                if (arr.element(j).labelCDQ === 1) {
                    if (onInsert) await onInsert(j);
                }
            }
            if (arr.element(i).labelCDQ === 2) {
                if (onQuery) await onQuery(i);
            }
        }
        if (onEndMerge2) await onEndMerge2(l, r);
        if (onSortDim3) await onSortDim3(l, r);
    }
    async function CDQ1(l, r) {
        if (l === r) return;
        const mid = (l + r) >> 1;
        await CDQ1(l, mid);
        await CDQ1(mid + 1, r);
        if (onStartMerge1) await onStartMerge1(l, r);
        for (let i = l; i <= mid; i++) arr.element(i).labelCDQ = 1;
        for (let i = mid + 1; i <= r; i++) arr.element(i).labelCDQ = 2;
        if (onSortDim2) await onSortDim2(l, r);
        await CDQ2(l, r);
        if (onEndMerge1) await onEndMerge1(l, r);
    }

    if (onSortDim1) await onSortDim1();
    await CDQ1(arr.start(), arr.end());
}

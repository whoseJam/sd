import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseArary} arr
 * @param {{
 *  onCheckALessThanB: (a: sd.SDNode, b: sd.SDNode) => boolean;
 *  onMoveI: (i: number) => void;
 *  onMoveJ: (j: number) => void;
 *  onStartMerge: (l: number, r: number) => void;
 *  onEndMerge: (l: number, r: number) => void;
 *  onSortDim1: () => void;
 *  onSortDim2: (l: number, r: number) => void;
 *  onInsert: (j: number) => void;
 *  onQuery: (i: number) => void;
 * }} args
 */
export async function CDQ3D(arr, args) {
    const onCheckALessThanB = args.onCheckALessThanB;
    const onMoveI = args.onMoveI;
    const onMoveJ = args.onMoveJ;
    const onStartMerge = args.onStartMerge;
    const onEndMerge = args.onEndMerge;
    const onSortDim1 = args.onSortDim1;
    const onSortDim2 = args.onSortDim2;
    const onInsert = args.onInsert;
    const onQuery = args.onQuery;

    async function CDQ(l, r) {
        if (l === r) return;
        const mid = (l + r) >> 1;
        await CDQ(l, mid);
        await CDQ(mid + 1, r);

        if (onStartMerge) await onStartMerge(l, r);
        let j = l - 1;
        for (let i = mid + 1; i <= r; i++) {
            if (onMoveI) await onMoveI(i);
            while (j + 1 <= mid && (await onCheckALessThanB(arr.element(j + 1), arr.element(i)))) {
                j++;
                if (onMoveJ) await onMoveJ(j);
                if (onInsert) await onInsert(j);
            }
            if (onQuery) await onQuery(i);
        }
        if (onEndMerge) await onEndMerge(l, r);
        if (onSortDim2) await onSortDim2(l, r);
    }
    if (onSortDim1) await onSortDim1();
    await CDQ(arr.start(), arr.end());
}

import * as sd from "@/sd";

/**
 * @param {sd.BaseArary} arr
 * @param {{
 *  onMoveI: (i: number) => void | Promise<any>;
 *  onSortDim1: () => void | Promise<any>;
 *  onQuery: (i: number) => void | Promise<any>;
 *  onInsert: (i: number) => void | Promise<any>;
 * }} args
 */
export async function dataStructurePO2D(arr, args) {
    const onMoveI = args.onMoveI;
    const onSortDim1 = args.onSortDim1;
    const onQuery = args.onQuery;
    const onInsert = args.onInsert;

    if (onSortDim1) await onSortDim1();

    for (let i = arr.start(); i <= arr.end(); i++) {
        if (onMoveI) await onMoveI(i);
        if (onQuery) await onQuery(i);
        if (onInsert) await onInsert(i);
    }
}

import * as sd from "@/sd";

/**
 * @param {sd.BaseArray} arr 
 * @param {{
 *  onCreateFirstBucket: (arr: sd.BaseArary, cx: number) => void
 *  onCreateBucket: (arr: sd.BaseArary, i: number) => void
 *  onUpdateBucket: (arr: sd.BaseArary, j: number) => void
 *  onUpdateCurrent: (arr: sd.BaseArary, i: number) => void
 * }} args 
 */
export async function bucketOptimize(arr, posI, args) {
    const onCreateFirstBucket = args.onCreateFirstBucket;
    const onCreateBucket = args.onCreateBucket;
    const onUpdateBucket = args.onUpdateBucket;
    const onUpdateCurrent = args.onUpdateCurrent;

    if (onCreateFirstBucket) {
        await onCreateFirstBucket(arr, arr.firstElement().cx() - arr.elementWidth());
    }
    for (let i = arr.start(); i <= posI; i++) {
        if (onCreateBucket) {
            await onCreateBucket(arr, i);
        }
    }
    for (let i = arr.start(); i < posI; i++) {
        if (onUpdateBucket) {
            await onUpdateBucket(arr, i);
        }
    }
    if (onUpdateCurrent) {
        await onUpdateCurrent(arr, posI);
    }
}
import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseTree} ac
 * @param {sd.BaseArray} arr
 * @param {{
 *  onStartMatch: () => void;
 *  onRemoveFocusNode: (u: number) => void;
 *  onStartMatchAt: (i: number) => void;
 *  onFailJumpTo: (nextFail: number, prevFail: number, i: number) => void;
 *  onMatchExtended: (u: number, i: number) => void;
 *  onMatchFailed: (u: number, i: number) => void;
 * }} args
 */
export async function matchOnACMachine(ac, arr, args) {
    const C = sd.color();
    const onStartMatch = args.onStartMatch;
    const onStartMatchAt = args.onStartMatchAt;
    const onFailJumpTo = args.onFailJumpTo;
    const onMatchExtended = args.onMatchExtended;
    const onMatchFailed = args.onMatchFailed;

    let u = 1;

    if (onStartMatch) await onStartMatch();
    for (let i = arr.start(); i <= arr.end(); i++) {
        if (onStartMatchAt) {
            await onStartMatchAt(i);
        }
        const character = arr.text(i);
        while (u && !ac.element(u).acch[character]) {
            if (onFailJumpTo) await onFailJumpTo(ac.element(u).fail, u, i);
            u = ac.element(u).fail;
        }
        if (ac.element(u).acch[character]) {
            u = ac.element(u).acch[character];
            if (onMatchExtended) await onMatchExtended(u, i);
        } else {
            u = 1;
            if (onMatchFailed) await onMatchFailed(u, i);
        }
    }
}

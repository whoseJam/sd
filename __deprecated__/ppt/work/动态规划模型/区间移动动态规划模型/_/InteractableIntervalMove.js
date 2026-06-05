import * as sd from "@/sd";

/**
 * @param {*} arr
 * @param {number} start
 * @param {{
 *  onMove: (source: number, target: number) => void | Promise<any>;
 * }} args
 */
export function interactableIntervalMove(arr, start, args) {
    const onMove = args.onMove;
    const D = sd.device();
    D.onKeyDown("a", () => {
        sd.inter(async () => {
            await tryMove(-1);
        });
    });
    D.onKeyDown("d", () => {
        sd.inter(async () => {
            await tryMove(1);
        });
    });
    let l = start;
    let r = start;
    let at = start;
    const left = arr._ ? arr.start() : 0;
    const right = arr._ ? arr.end() : arr.length - 1;
    async function tryMove(direction) {
        if (direction === -1) {
            if (l > left) {
                l--;
                if (onMove) await onMove(at, l);
                at = l;
            }
        } else {
            if (r < right) {
                r++;
                if (onMove) await onMove(at, r);
                at = r;
            }
        }
    }
}

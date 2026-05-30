import * as sd from "@/sd";

/**
 * @param {sd.Array} str
 * @param {{
 *  onIMove: (i: number) => void
 *  onCheckMirrorSymmetry: (center: number, length: number) => void
 *  onILengthInitialized: (i: number, length: number) => void
 *  onILengthExtended: (i: number, length: number) => void
 *  onILengthCalcFinished: (i: number, length: number) => void
 *  onMirrorSymmetryCenterUpdated: (center: number, length: number) => void
 * }} args
 */
export async function Manacher(str, args) {
    const onIMove = args.onIMove;
    const onCheckMirrorSymmetry = args.onCheckMirrorSymmetry;
    const onILengthInitialized = args.onILengthInitialized;
    const onILengthExtended = args.onILengthExtended;
    const onILengthCalcFinished = args.onILengthCalcFinished;
    const onMirrorSymmetryCenterUpdated = args.onMirrorSymmetryCenterUpdated;

    const len = sd.make1d(str.length() * 5, 1);

    await sd.pause();
    const cx = str.cx();
    let data = "";
    for (let i = str.start(); i <= str.end(); i++) data = data + str.text(i);
    str.startAnimate();
    str.freeze();
    str.insert(0, "{");
    str.insert(1, "#");
    for (let i = 1; i < data.length; i++) {
        str.insert(i * 2 + 1, "#");
    }
    str.push("#").push("}").cx(cx);
    str.unfreeze();
    str.endAnimate();

    let max = 0,
        pos = 0;
    for (let i = str.start() + 1; i <= str.end() - 1; i++) {
        if (onIMove) await onIMove(i);

        if (max > i) {
            if (onCheckMirrorSymmetry) await onCheckMirrorSymmetry(pos * 2 - i, len[pos * 2 - i]);
            len[i] = Math.min(len[pos * 2 - i], max - i);
        } else len[i] = 1;

        if (onILengthInitialized) await onILengthInitialized(i, len[i]);

        while (i + len[i] <= str.end() && i - len[i] >= str.start() && str.text(i + len[i]) == str.text(i - len[i])) {
            len[i]++;
            if (onILengthExtended) await onILengthExtended(i, len[i]);
        }

        if (max < i + len[i]) {
            max = i + len[i];
            pos = i;
            if (onMirrorSymmetryCenterUpdated) await onMirrorSymmetryCenterUpdated(i, len[i]);
        }

        if (onILengthCalcFinished) await onILengthCalcFinished(i, len[i]);
    }
}

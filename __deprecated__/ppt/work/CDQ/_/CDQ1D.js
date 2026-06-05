import * as sd from "@/sd";

/**
 * @param {sd.BaseArary} arr
 * @param {} args
 */
export async function CDQ1D(arr, args) {
    await sd.pause();
    arr.startAnimate().sort().endAnimate();
    const pJ = sd.Pointer(arr, "j", "b");
    const pI = sd.Pointer(arr, "i", "b");
    const r = sd.Focus(arr);
    for (let i = arr.start(), j = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        pI.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        while (j <= arr.end() && arr.intValue(j) < arr.intValue(i)) {
            pJ.startAnimate().moveTo(j++).endAnimate();
        }
        if (arr.start() < j) {
            r.after(pJ).startAnimate();
            r.focus(arr.start(), j - 1);
            r.endAnimate();
        }
    }
}

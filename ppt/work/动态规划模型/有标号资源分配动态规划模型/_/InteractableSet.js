import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseArary} arr
 * @param {{
 *  once: boolean;
 *  onCreateMath: (math: sd.Math) => void | Promise<any>;
 *  onChangeStatus: (i: number, selected: 0|1) => void | Promise<any>;
 * }} args
 */
export async function interactableSet(arr, args) {
    const once = args.once;
    const onCreateMath = args.onCreateMath;
    const onChangeStatus = args.onChangeStatus;

    const math = new sd.Math(arr, "0".repeat(arr.length()));
    if (onCreateMath) await onCreateMath(math);
    else math.cx(arr.cx()).y(arr.my() + 20);

    let label = "0".repeat(arr.length());

    arr.forEachElement((element, idx) => {
        let selected = 0;
        const i = idx - arr.start();
        element.onClick(() => {
            if (once && selected) return;
            sd.inter(async () => {
                selected ^= 1;
                label = `${label.slice(0, i)}${selected}${label.slice(i + 1)}`;
                math.startAnimate().text(label).endAnimate();
                if (onChangeStatus) await onChangeStatus(idx, selected);
            });
        });
    });
}

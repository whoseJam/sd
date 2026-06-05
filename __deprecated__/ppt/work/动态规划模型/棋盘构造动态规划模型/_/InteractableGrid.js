import * as sd from "@/sd";

/**
 *
 * @param {number} n
 * @param {number} m
 * @param {{
 *  onChangeStatus: (element: sd.SDNode, i: number, j: number, status: number) => boolean;
 *  totalStatus: number;
 * }} args
 */
export function interactableGrid(n, m, args) {
    const onChangeStatus = args.onChangeStatus;
    const totalStatus = args.totalStatus;

    const svg = sd.svg();
    const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
    grid.forEachElement((element, rowId, colId) => {
        let status = 0;
        element.onClick(() => {
            sd.inter(async () => {
                const nextStatus = (status + 1) % totalStatus;
                const success = await onChangeStatus(element, rowId, colId, nextStatus);
                if (success) status = nextStatus;
            });
        });
    });
    return grid;
}

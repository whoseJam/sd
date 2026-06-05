import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseTree} tree
 * @param {{
 *  onCreateTable: (table: sd.Grid) => void;
 *  onStartFa: (u: string) => void;
 *  onFa: (u: string, fa: string, mid: string) => void;
 *  onEndFa: (u: string, fa: Array<string>) => void;
 * }} args
 */
export async function LCAPrepare(tree, args) {
    const svg = sd.svg();
    const R = sd.rule();

    const onCreateTable = args.onCreateTable;
    const onStartFa = args.onStartFa;
    const onFa = args.onFa;
    const onEndFa = args.onEndFa;

    const table = new sd.Grid(svg).startN(1).axis("col").align("my");
    const n = tree.nodes().length;
    const m = Math.ceil(Math.log2(tree.depth()));
    const fa = sd.make2d(n + 1, m);
    table.n(n).m(m);

    for (let i = 1; i <= n; i++) {
        table.element(i, 0).childAs(new sd.Text(svg, i), R.aside("bc", 3));
    }
    for (let i = 0; i < m; i++) {
        table.element(1, i).childAs(new sd.Math(svg, `2^${i}`), R.aside("lc", 5));
    }
    if (onCreateTable) await onCreateTable(table);
    for (let u = 1; u <= n; u++) {
        if (onStartFa) await onStartFa(u);
        fa[u][0] = tree.fatherId(u);
        if (!fa[u][0]) fa[u][0] = 0;
        for (let i = 0; i < m; i++) {
            if (i > 0) fa[u][i] = fa[+fa[u][i - 1]][i - 1];
            if (fa[u][i]) {
                if (onFa) await onFa(u, fa[u][i], i > 0 ? fa[u][i - 1] : undefined);
            }
        }
        if (onEndFa) await onEndFa(u, fa[u]);
    }
}

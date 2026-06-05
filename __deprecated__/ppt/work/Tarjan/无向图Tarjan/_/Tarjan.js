import * as sd from "@/sd";

/**
 * @param {TreeGraph} graph
 * @param {{
 *  onAddLowAndDfn: (u: number, low: number, dfn: number) => void | Promise<any>;
 *  onPushStack: (u: number) => void | Promise<any>;
 *  onTreeLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onAncestorLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onUpdateLow: (u: number, low: number) => void | Promise<any>;
 *  onBCC: (u: number) => void | Promise<any>;
 *  onNotBCC: (u: number, low: number, ancestor: number) => void | Promise<any>;
 *  onArticulationPoint: (u: number) => void | Promise<any>;
 *  onBridge: (u: number, v: number, link: any) => void | Promise<any>;
 *  onPopStack: (u: number) => void | Promise<any>;
 * }} args
 */
export async function tarjan(graph, args) {
    const onAddLowAndDfn = args.onAddLowAndDfn;
    const onPushStack = args.onPushStack;
    const onTreeLink = args.onTreeLink;
    const onAncestorLink = args.onAncestorLink;
    const onUpdateLow = args.onUpdateLow;
    const onBCC = args.onBCC;
    const onNotBCC = args.onNotBCC;
    const onArticulationPoint = args.onArticulationPoint;
    const onBridge = args.onBridge;
    const onPopStack = args.onPopStack;
    const n = graph.nodes().length;
    const isa = sd.make1d(n + 5);
    const low = sd.make1d(n + 5);
    const dfn = sd.make1d(n + 5);
    const prt = sd.make1d(n + 5);
    const stk = sd.make1d(n + 5);
    let tot = 0;
    let top = 0;
    let cnt = 0;
    async function dfs(u) {
        low[u] = dfn[u] = ++tot;
        if (onAddLowAndDfn) await onAddLowAndDfn(u, tot, tot);
        stk[++top] = u;
        if (onPushStack) await onPushStack(u);
        const [links, nodes] = graph.outLinksAndNodes(u);
        for (let i = 0; i < links.length; i++) {
            const v = +graph.nodeId(nodes[i]);
            if (prt[u] === links[i].id) continue;
            if (!dfn[v]) {
                if (onTreeLink) await onTreeLink(u, v, links[i]);
                prt[v] = links[i].id;
                await dfs(v);
                low[u] = Math.min(low[u], low[v]);
                if (onUpdateLow) await onUpdateLow(u, low[u]);
                if (low[v] > dfn[u]) {
                    if (onBridge) await onBridge(u, v, links[i]);
                }
                if (low[v] >= dfn[u]) {
                    isa[u] = true;
                    if (u === 1) cnt++;
                }
            } else {
                if (onAncestorLink && dfn[v] < dfn[u]) await onAncestorLink(u, v, links[i]);
                low[u] = Math.min(low[u], dfn[v]);
                if (onUpdateLow) await onUpdateLow(u, low[u]);
            }
        }
        if (low[u] === dfn[u]) {
            if (onBCC) await onBCC(u);
            while (top) {
                const cur = stk[top--];
                if (onPopStack) await onPopStack(cur);
                if (cur === u) break;
            }
        } else {
            const v = dfn.indexOf(low[u]);
            if (onNotBCC) await onNotBCC(u, low[u], v);
        }
    }
    await dfs(1);
    for (let i = 1; i <= n; i++) {
        if (i !== 1) {
            if (isa[i]) {
                if (onArticulationPoint) await onArticulationPoint(i);
            }
        } else {
            if (cnt >= 2) {
                if (onArticulationPoint) await onArticulationPoint(i);
            }
        }
    }
}

/**
 * @param {HugeGraph} graph
 * @param {{
 *  onAddLowAndDfn: (u: [number, number], low: number, dfn: number) => void | Promise<any>;
 *  onPushStack: (u: [number, number]) => void | Promise<any>;
 *  onTreeLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onAncestorLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onBCC: (u: [number, number]) => void | Promise<any>;
 *  onPopStack: (u: [number, number]) => void | Promise<any>;
 * }} args
 */
export async function tarjanForNestedGraph(graph, args) {
    const onAddLowAndDfn = args.onAddLowAndDfn;
    const onPushStack = args.onPushStack;
    const onTreeLink = args.onTreeLink;
    const onAncestorLink = args.onAncestorLink;
    const onBCC = args.onBCC;
    const onPopStack = args.onPopStack;
    const n = graph.nodes().length;
    const m = 30;
    const low = sd.make2d(n + 5, m + 5);
    const dfn = sd.make2d(n + 5, m + 5);
    const ins = sd.make2d(n + 5, m + 5);
    const stk = sd.make2d(n + 5, m + 5);
    const prt = sd.make2d(n + 5, m + 5);
    let tot = 0;
    let top = 0;
    const equal = (u, v) => {
        return String(u[0]) === String(v[0]) && String(u[1]) === String(v[1]);
    };
    async function dfs(u) {
        const [g, x] = u;
        low[g][x] = dfn[g][x] = ++tot;
        if (onAddLowAndDfn) await onAddLowAndDfn(u, tot, tot);
        stk[++top] = u;
        if (onPushStack) await onPushStack(u);
        const [links, nodes, ids] = graph.outLinksAndNodes(u);
        for (let i = 0; i < links.length; i++) {
            const v = ids[i];
            const [g_, v_] = v;
            if (prt[g][x] === links[i].id) continue;
            if (!dfn[g_][v_]) {
                if (onTreeLink) await onTreeLink(u, v, links[i]);
                prt[g_][v_] = links[i].id;
                await dfs(v);
                low[g][x] = Math.min(low[g][x], low[g_][v_]);
            } else {
                if (onAncestorLink && dfn[v] < dfn[u]) await onAncestorLink(u, v, links[i]);
                low[g][x] = Math.min(low[g][x], dfn[g_][v_]);
            }
        }
        if (low[g][x] === dfn[g][x]) {
            if (onBCC) await onBCC(u);
            while (top) {
                const cur = stk[top--];
                if (onPopStack) await onPopStack(cur);
                if (equal(cur, u)) break;
            }
        }
    }
    await dfs([1, 1]);
}

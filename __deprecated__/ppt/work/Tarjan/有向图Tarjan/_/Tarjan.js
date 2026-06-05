import * as sd from "@/sd";
import { HugeGraph } from "./HugeGraph";
import { TreeGraph } from "./TreeGraph";

/**
 * @param {TreeGraph} graph
 * @param {{
 *  onAddLowAndDfn: (u: number, low: number, dfn: number) => void | Promise<any>;
 *  onPushStack: (u: number) => void | Promise<any>;
 *  onTreeLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onAncestorLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onForwardLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onCrossLink: (u: number, v: number, link: any) => void | Promise<any>;
 *  onUpdateLow: (u: number, low: number) => void | Promise<any>;
 *  onSCC: (u: number) => void | Promise<any>;
 *  onNotSCC: (u: number, low: number, ancestor: number) => void | Promise<any>;
 *  onPopStack: (u: number) => void | Promise<any>;
 * }} args
 */
export async function tarjan(graph, args) {
    const onAddLowAndDfn = args.onAddLowAndDfn;
    const onPushStack = args.onPushStack;
    const onTreeLink = args.onTreeLink;
    const onAncestorLink = args.onAncestorLink;
    const onForwardLink = args.onForwardLink;
    const onCrossLink = args.onCrossLink;
    const onUpdateLow = args.onUpdateLow;
    const onSCC = args.onSCC;
    const onNotSCC = args.onNotSCC;
    const onPopStack = args.onPopStack;
    const n = graph.nodes().length;
    const low = sd.make1d(n + 5);
    const dfn = sd.make1d(n + 5);
    const ins = sd.make1d(n + 5);
    const stk = sd.make1d(n + 5);
    const prt = sd.make1d(n + 5);
    let tot = 0;
    let top = 0;
    const isAncestor = (a, u) => {
        while (prt[u] && String(u) !== String(a)) u = prt[u];
        return String(u) === String(a);
    };
    async function dfs(u) {
        low[u] = dfn[u] = ++tot;
        if (onAddLowAndDfn) await onAddLowAndDfn(u, tot, tot);
        ins[(stk[++top] = u)] = true;
        if (onPushStack) await onPushStack(u);
        const [links, nodes] = graph.outLinksAndNodes(u);
        for (let i = 0; i < links.length; i++) {
            const v = +graph.nodeId(nodes[i]);
            if (!dfn[v]) {
                if (onTreeLink) await onTreeLink(u, v, links[i]);
                prt[v] = u;
                await dfs(v);
                low[u] = Math.min(low[u], low[v]);
                if (onUpdateLow) await onUpdateLow(u, low[u]);
            } else {
                if (isAncestor(v, u)) {
                    if (onAncestorLink) await onAncestorLink(u, v, links[i]);
                } else if (isAncestor(u, v)) {
                    if (onForwardLink) await onForwardLink(u, v, links[i]);
                } else {
                    if (onCrossLink) await onCrossLink(u, v, links[i]);
                }
                if (ins[v]) {
                    low[u] = Math.min(low[u], dfn[v]);
                    if (onUpdateLow) await onUpdateLow(u, low[u]);
                }
            }
        }
        if (low[u] === dfn[u]) {
            if (onSCC) await onSCC(u);
            while (top) {
                const cur = stk[top--];
                if (onPopStack) await onPopStack(cur);
                ins[cur] = false;
                if (cur === u) break;
            }
        } else {
            const v = dfn.indexOf(low[u]);
            if (onNotSCC) await onNotSCC(u, low[u], v);
        }
    }
    await dfs(1);
}

/**
 * @param {HugeGraph} graph
 * @param {{
 *  onAddLowAndDfn: (u: [number, number], low: number, dfn: number) => void | Promise<any>;
 *  onPushStack: (u: [number, number]) => void | Promise<any>;
 *  onTreeLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onAncestorLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onForwardLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onCrossLink: (u: [number, number], v: [number, number], link: any) => void | Promise<any>;
 *  onSCC: (u: [number, number]) => void | Promise<any>;
 *  onPopStack: (u: [number, number]) => void | Promise<any>;
 * }} args
 */
export async function tarjanForNestedGraph(graph, args) {
    const onAddLowAndDfn = args.onAddLowAndDfn;
    const onPushStack = args.onPushStack;
    const onTreeLink = args.onTreeLink;
    const onAncestorLink = args.onAncestorLink;
    const onForwardLink = args.onForwardLink;
    const onCrossLink = args.onCrossLink;
    const onSCC = args.onSCC;
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
    const isAncestor = (a, u) => {
        while (prt[u[0]][u[1]] && !equal(u, a)) u = prt[u[0]][u[1]];
        return equal(u, a);
    };
    async function dfs(u) {
        const [g, x] = u;
        low[g][x] = dfn[g][x] = ++tot;
        if (onAddLowAndDfn) await onAddLowAndDfn(u, tot, tot);
        stk[++top] = u;
        ins[g][x] = true;
        if (onPushStack) await onPushStack(u);
        const [links, nodes, ids] = graph.outLinksAndNodes(u);
        for (let i = 0; i < links.length; i++) {
            const v = ids[i];
            const [g_, v_] = v;
            if (!dfn[g_][v_]) {
                if (onTreeLink) await onTreeLink(u, v, links[i]);
                prt[g_][v_] = u;
                await dfs(v);
                low[g][x] = Math.min(low[g][x], low[g_][v_]);
            } else {
                if (isAncestor(v, u)) {
                    if (onAncestorLink) await onAncestorLink(u, v, links[i]);
                } else if (isAncestor(u, v)) {
                    if (onForwardLink) await onForwardLink(u, v, links[i]);
                } else {
                    if (onCrossLink) await onCrossLink(u, v, links[i]);
                }
                if (ins[g_][v_]) low[g][x] = Math.min(low[g][x], dfn[g_][v_]);
            }
        }
        if (low[g][x] === dfn[g][x]) {
            if (onSCC) await onSCC(u);
            while (top) {
                const cur = stk[top--];
                if (onPopStack) await onPopStack(cur);
                ins[cur[0]][cur[1]] = false;
                if (equal(cur, u)) break;
            }
        }
    }
    await dfs([1, 1]);
}

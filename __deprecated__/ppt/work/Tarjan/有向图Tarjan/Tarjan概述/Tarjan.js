import * as sd from "@/sd";

export async function Tarjan(n, stack, Element, ToNodes, args) {
    const svg = sd.svg();
    const C = sd.color();

    const OnTraceBack = args.OnTraceBack ? args.OnTraceBack : undefined;

    const colorList = [C.orange, C.blue, C.green, C.red, C.yellow, C.cyan, C.grey, C.azure];
    const low = sd.make1d(n + 5);
    const dfn = sd.make1d(n + 5);
    const ins = sd.make1d(n + 5);
    const stk = sd.make1d(n + 5);
    const prt = sd.make1d(n + 5);
    let tot = 0;
    let top = 0;
    let SCC = 0;

    function IsAncesstor(a, u) {
        while (prt[u] && u != a) u = prt[u];
        return u == a;
    }

    function LinkTo(link, color) {
        const clazz = link.clazz ? link.clazz : sd.Line;
        const l = new clazz(svg);
        l.source(link.source());
        l.target(link.target());
        l.stroke(color).strokeWidth(2.5);
        l.startAnimate().pointStoT().endAnimate().arrow();
    }

    async function Dfs(u) {
        low[u] = dfn[u] = ++tot;

        await sd.pause();
        const textOld = Element(u).value();
        const textNew = new sd.Text(svg, u).fontSize(textOld.fontSize()).center(textOld.center());
        stack.startAnimate().pushFromExistValue(textNew).endAnimate();

        ins[(stk[++top] = u)] = true;

        const toNodes = ToNodes(u);
        for (let to of toNodes) {
            const v = to.id;
            await sd.pause();
            if (!dfn[v]) {
                LinkTo(to.link, C.textBlue);
                prt[v] = u;
                await Dfs(to.id);
                low[u] = Math.min(low[u], low[v]);
            } else {
                LinkTo(to.link, IsAncesstor(v, u) ? C.red : IsAncesstor(u, v) ? C.orange : C.purple);
                if (ins[v]) low[u] = Math.min(low[u], dfn[v]);
            }
        }

        if (low[u] === dfn[u]) {
            await sd.pause();
            Element(u).startAnimate().strokeWidth(3).endAnimate();
            while (top) {
                const cur = stk[top--];
                ins[cur] = false;
                await sd.pause();
                stack.startAnimate();
                stack.color(stack.end(), colorList[SCC]);
                stack.startAnimate();
                Element(cur).startAnimate().color(colorList[SCC]).endAnimate();
                await sd.pause();
                stack.startAnimate();
                stack.pop();
                stack.endAnimate();
                if (cur === u) break;
            }
            SCC++;
        } else {
            await sd.pause();
            const v = dfn.indexOf(low[u]);

            let link = undefined;
            if (OnTraceBack) {
                link = OnTraceBack(Element(u), Element(v), u, v);
            } else {
                link = sd.Link(Element(u), Element(v));
            }
            link.stroke(C.grey).startAnimate().pointStoT().endAnimate().arrow();
        }
    }

    await Dfs(1);
}

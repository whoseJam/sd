import * as sd from "@/sd";

export function suffixMachine(str) {
    const N = str.length * 2;
    const len = sd.make1d(N + 5);
    const fa = sd.make1d(N + 5);
    const ch = sd.make2d(N + 5, 26);
    let tot = 0;
    let lst = 0;
    let rt = 0;
    function charCode(a) {
        return a.charCodeAt(0);
    }
    function newNode(l) {
        len[++tot] = l;
        return tot;
    }
    function insert(v) {
        let p = lst;
        const u = newNode(len[p] + 1);
        lst = u;
        for (; p && !ch[p][v]; p = fa[p]) ch[p][v] = u;
        if (!p) {
            fa[u] = rt;
        } else {
            const nxt = ch[p][v];
            if (len[p] + 1 == len[nxt]) fa[u] = nxt;
            else {
                const uu = newNode(len[p] + 1);
                for (let i = 0; i < 26; i++) ch[uu][i] = ch[u][i];
                fa[uu] = fa[nxt];
                fa[nxt] = fa[u] = uu;
                for (; p && ch[p][w] == nxt; p = fa[p]) ch[p][v] = uu;
            }
        }
    }
    function init() {
        rt = lst = newNode(0);
    }
    init();
    for (let i = 0; i < str.length; i++) insert(charCode(str[i]) - charCode("a"));
    return [fa, ch, len, tot, lst];
}

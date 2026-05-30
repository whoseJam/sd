import * as sd from "@/sd";

/**
 * 构建Trie树
 * @param {sd.BaseTree} ac
 * @param {Array<string>} strs
 * @param {{
 *  onLink: (u: number, v: number) => void;
 *  onReachEndOfString: (u: number) => void;
 * }} args
 */
export async function buildTrieTree(ac, strs, args = {}) {
    const R = sd.rule();
    const onLink = args.onLink;
    const onReachEndOfString = args.onReachEndOfString;

    let tot = 1;
    ac.root(1);
    ac.element(1).str = "";
    ac.element(1).acch = {};
    async function insert(s) {
        let u = 1;
        for (let i = 0; i < s.length; i++) {
            const cur = ac.element(u);
            if (!cur.acch[s[i]]) {
                cur.acch[s[i]] = ++tot;
                ac.link(u, tot);
                ac.element(u, tot).value(s[i], R.pointAtPathByRate(0.5, "mx", "cy", -5));
                ac.element(tot).str = s.substr(0, i + 1);
                ac.element(tot).acch = {};
                if (onLink) await onLink(+u, +tot);
            }
            u = cur.acch[s[i]];
        }
        ac.element(u).is_end = true;
        if (onReachEndOfString) await onReachEndOfString(u);
    }
    for (let i = 0; i < strs.length; i++) {
        await insert(strs[i]);
    }
    for (let i = 1; i <= tot; i++) {
        ac.element(i).fail = 0;
    }
}

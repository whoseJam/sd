import * as sd from "@/sd";

/**
 * @param {sd.BaseTree} trie
 * @param {Array<string>} strs
 * @param {{
 *  onLink: (u: number, v: number) => void;
 *  onReachEndOfString: (u: number) => void;
 * }} args
 */
export async function build01TrieTree(trie, strs, args = {}) {
    const R = sd.rule();
    const onLink = args.onLink;
    const onReachEndOfString = args.onReachEndOfString;

    let tot = 1;
    trie.root(1);
    trie.element(1).str = "";
    trie.element(1).acch = {};
    async function insert(s) {
        let u = 1;
        for (let i = 0; i < s.length; i++) {
            const cur = trie.element(u);
            if (!cur.acch[s[i]]) {
                let rule = undefined;
                cur.acch[s[i]] = ++tot;
                if (s[i] === "0") {
                    trie.leftChild(u, tot);
                    rule = R.pointAtPathByRate(0.5, "mx", "cy", -5);
                } else {
                    trie.rightChild(u, tot);
                    if (i !== s.length - 1) rule = R.pointAtPathByRate(0.5, "mx", "cy", -5);
                    else rule = R.pointAtPathByRate(0.5, "x", "cy", 5);
                }
                trie.element(u, tot).value(s[i], rule);
                trie.element(tot).str = s.substr(0, i + 1);
                trie.element(tot).acch = {};
                if (onLink) await onLink(+u, +tot);
            }
            u = cur.acch[s[i]];
        }
        trie.element(u).is_end = true;
        if (onReachEndOfString) await onReachEndOfString(u);
    }
    for (let i = 0; i < strs.length; i++) {
        await insert(strs[i]);
    }
}

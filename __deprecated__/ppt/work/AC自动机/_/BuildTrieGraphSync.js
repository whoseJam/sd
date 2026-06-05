import * as sd from "@/sd";

/**
 * 构建Trie图
 * @param {sd.BaseTree} ac
 * @param {{
 *  onLink: (sourceId: number, targetId: number, character: string) => void;
 * }} args
 */
export function buildTrieGraphSync(ac, characterSet, args) {
    const onLink = args.onLink;
    const Q = [1];

    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();

        for (let i = 0; i < characterSet.length; i++) {
            const character = characterSet[i];
            const v = getChild(u, character);
            const fail = ac.element(u).fail;
            const next = Math.max(getChild(fail, character), 1);
            if (!v) {
                setChild(u, character, next);
                if (onLink) onLink(+u, +next, character);
            } else {
                Q.push(v);
                ac.element(v).fail = next;
                if (onLink) onLink(+v, +next);
            }
        }
    }
    function getChild(u, character) {
        if (!u) return 0;
        return ac.element(u).acch[character];
    }
    function setChild(u, character, v) {
        if (!u) return 0;
        ac.element(u).acch[character] = v;
    }
}

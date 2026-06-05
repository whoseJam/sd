import * as sd from "@/sd";

/**
 * 构建Trie图
 * @param {sd.BaseTree} ac
 * @param {{
 *  onLink: (sourceId: number, targetId: number, character: string) => void;
 *  onStartBuild: (u: number) => void;
 *  onEndBuild: (u: number) => void;
 *  onStartBuildChild: (v: number) => void;
 *  onEndBuildChild: (v: number) => void;
 * }} args
 */
export async function buildTrieGraph(ac, characterSet, args) {
    const onLink = args.onLink;
    const onStartBuild = args.onStartBuild;
    const onEndBuild = args.onEndBuild;
    const onStartBuildChild = args.onStartBuildChild;
    const onEndBuildChild = args.onEndBuildChild;
    const Q = [1];

    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();
        if (onStartBuild) await onStartBuild(u);

        for (let i = 0; i < characterSet.length; i++) {
            const character = characterSet[i];
            const v = getChild(u, character);
            const fail = ac.element(u).fail;
            const next = Math.max(getChild(fail, character), 1);
            if (!v) {
                setChild(u, character, next);

                if (onLink) await onLink(+u, +next, character);
            } else {
                if (onStartBuildChild) await onStartBuildChild(v);
                Q.push(v);
                ac.element(v).fail = next;
                if (onLink) await onLink(+v, +next);

                if (onEndBuildChild) await onEndBuildChild(v);
            }
        }

        if (onEndBuild) await onEndBuild(u);
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

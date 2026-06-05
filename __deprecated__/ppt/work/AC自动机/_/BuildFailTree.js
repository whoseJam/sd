import * as sd from "@/sd";

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
 *  onLink: (sourceId: number, targetId: number) => void;
 *  onStartBuild: (u: number) => void;
 *  onEndBuild: (u: number) => void;
 *  onStartBuildChild: (v: number) => void;
 *  onEndBuildChild: (v: number) => void;
 *  onFailJumpTo: (fail: number, parent: number) => void;
 * }} args
 */
export async function buildFailTree(ac, args) {
    const onLink = args.onLink;
    const onStartBuild = args.onStartBuild;
    const onEndBuild = args.onEndBuild;
    const onStartBuildChild = args.onStartBuildChild;
    const onEndBuildChild = args.onEndBuildChild;
    const onFailJumpTo = args.onFailJumpTo;
    const Q = [1];

    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();

        if (onStartBuild) await onStartBuild(u);
        const children = ac.children(u);
        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]);
            Q.push(v);
            if (onStartBuildChild) await onStartBuildChild(v);
            const character = ac.value(u, v).text();

            let f = ac.element(u).fail;
            let first = true;
            while (f && !ac.element(f).acch[character]) {
                if (onFailJumpTo) {
                    await onFailJumpTo(f, u, first);
                    first = false;
                }
                f = ac.element(f).fail;
            }

            if (f && ac.element(f).acch[character]) {
                if (onFailJumpTo) {
                    await onFailJumpTo(f, u, first);
                    first = false;
                }

                const failOfV = ac.element(f).acch[character];
                if (onLink) await onLink(+v, +failOfV);
                ac.element(v).fail = failOfV;
            } else {
                if (onLink) await onLink(+v, 1);
                ac.element(v).fail = 1;
            }

            if (onEndBuildChild) await onEndBuildChild(v);
        }
        if (onEndBuild) await onEndBuild(u);
    }
}

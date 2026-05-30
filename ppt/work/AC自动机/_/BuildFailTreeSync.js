import * as sd from "@/sd";

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
 *  onLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number) => void
 * }} args
 */
export function buildFailTreeSync(ac, args = {}) {
    const onLink = args.onLink;
    const Q = [1];

    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();

        const children = ac.children(u);

        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]);
            Q.push(v);
            const character = ac.value(u, v).text();

            let f = ac.element(u).fail;
            while (f && !ac.element(f).acch[character]) {
                f = ac.element(f).fail;
            }

            if (f && ac.element(f).acch[character]) {
                const failOfV = ac.element(f).acch[character];
                if (onLink) onLink(+v, +failOfV);
                ac.element(v).fail = failOfV;
            } else {
                if (onLink) onLink(+v, 1);
                ac.element(v).fail = 1;
            }
        }
    }
}

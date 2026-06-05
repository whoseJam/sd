import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseTree} tree
 * @param {{
 *  onAdd: (u: string) => void;
 *  onAddSubtree: (subtree: Array<string>) => void;
 *  onRemoveSubtree: (subtree: Array<string>) => void;
 *  onPrepareFor: (u: string) => void;
 * }} args
 */
export async function DSU(tree, args) {
    const root = tree.root();
    const onAdd = args.onAdd;
    const onAddSubtree = args.onAddSubtree;
    const onRemoveSubtree = args.onRemoveSubtree;
    const onPrepareFor = args.onPrepareFor;

    function dfs1(u) {
        u.size = 1;
        u.son = undefined;
        tree.children(u).forEach(child => {
            dfs1(child);
            u.size += child.size;
            if (!u.son || u.son.size < child.size) u.son = child;
        });
    }
    async function dfs2(u) {
        const children = tree.children(u);
        for (const child of children) {
            if (child === u.son) continue;
            await dfs2(child);
            const subtree = tree.nodesInSubtree(child);
            if (onRemoveSubtree) await onRemoveSubtree(subtree.map(node => tree.nodeId(node)));
        }
        if (u.son) await dfs2(u.son);
        if (onPrepareFor) await onPrepareFor(tree.nodeId(u));
        for (const child of children) {
            if (child === u.son) continue;
            const subtree = tree.nodesInSubtree(child);
            if (onAddSubtree) await onAddSubtree(subtree.map(node => tree.nodeId(node)));
        }
        if (onAdd) await onAdd(tree.nodeId(u));
    }
    dfs1(root);
    await dfs2(root);
}

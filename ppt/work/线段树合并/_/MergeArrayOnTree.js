import * as sd from "@/sd";

/**
 *
 * @param {sd.BaseTree} tree
 * @param {{
 *  onMergeArray(u: string, v: string): void;
 * }} args
 */
export async function mergeArrayOnTree(tree, args) {
    const onMergeArray = args.onMergeArray;
    async function dfs(u) {
        const children = tree.children(u);
        for (let i = 0; i < children.length; i++) {
            const v = tree.nodeId(children[i]);
            await dfs(v);
            if (onMergeArray) await onMergeArray(u, v);
        }
    }
    await dfs(tree.rootId());
}

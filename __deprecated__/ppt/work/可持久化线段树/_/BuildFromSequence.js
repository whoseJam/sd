import * as sd from "@/sd";

/**
 * @param {{
 *  OnNewNode: () => number
 *  OnCreateValueAtLeaf: (tree: sd.BinaryTree, node: sd.SDNode, value: any) => void
 *  OnTreeCreated: (tree: sd.BinaryTree) => void
 * }} args
 */
export async function BuildFromSequence(seq, args, skipAll = false) {
    const svg = sd.svg();
    const C = sd.color();
    const OnNewNode = args.OnNewNode;
    const OnTreeCreated = args.OnTreeCreated;
    const OnCreateValueAtLeaf = args.OnCreateValueAtLeaf;

    const tree = new sd.BinaryTree(svg);
    if (OnTreeCreated) await OnTreeCreated(tree);

    async function Dfs(fa, childDirection, l, r) {
        const currentNodeId = OnNewNode();
        if (!fa) tree.root(currentNodeId);
        else tree.newNode(currentNodeId)[childDirection](fa, currentNodeId);
        const currentNode = tree.element(currentNodeId);
        currentNode.my_id = currentNodeId;
        
        if (l === r) {
            if (OnCreateValueAtLeaf) {
                await OnCreateValueAtLeaf(tree, currentNode, seq[l]);
            }
            return currentNode;
        }

        const mid = (l + r) >> 1;
        currentNode.left_child = await Dfs(currentNodeId, "leftChild", l, mid);
        currentNode.right_child = await Dfs(currentNodeId, "rightChild", mid + 1, r);
        return currentNode;
    }
    await Dfs(undefined, undefined, 1, seq.length - 1);
    return tree;
}
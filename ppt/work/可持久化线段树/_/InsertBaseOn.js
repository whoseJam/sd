import * as sd from "@/sd";

/**
 * @param {sd.BaseTree} lastTree
 * @param {{
 *  OnNewNode: () => number
 *  OnCreateValueAtLeaf: (x: number, value: any) => void
 *  OnTreeCreated: (tree: sd.BinaryTree) => void
 *  OnHistoryLeftChildLink: (current: sd.SDNode, last: sd.SDNode) => void
 *  OnHistoryRightChildLink: (current: sd.SDNode, last: sd.SDNode) => void
 *  VirtualLeftChild: boolean
 *  VirtualRightChild: boolean
 * }} args
 */
export async function InsertBaseOn(lastTree, n, position, value, args, skipAll = false) {
    const svg = sd.svg();
    const C = sd.color();
    const OnNewNode = args.OnNewNode;
    const OnCreateValueAtLeaf = args.OnCreateValueAtLeaf;
    const OnTreeCreated = args.OnTreeCreated;
    const OnHistoryLeftChildLink = args.OnHistoryLeftChildLink;
    const OnHistoryRightChildLink = args.OnHistoryRightChildLink;
    const VirtualLeftChild = args.VirtualLeftChild;
    const VirtualRightChild = args.VirtualRightChild;
    const currentTree = new sd.BinaryTree(svg);

    let virtualId = 100;

    if (OnTreeCreated) {
        await OnTreeCreated(currentTree);
    }

    async function Dfs(fa, childDirection, lastNode, l, r, position) {
        await sd.pause();

        const currentNodeId = OnNewNode();
        if (!fa) currentTree.startAnimate().root(currentNodeId).endAnimate();
        else currentTree.startAnimate().newNode(currentNodeId)[childDirection](fa, currentNodeId).endAnimate();
        const currentNode = currentTree.element(currentNodeId);
        currentNode.my_id = currentNodeId;
        currentNode.left_child = lastNode?.left_child;
        currentNode.right_child = lastNode?.right_child;

        if (l === r) {
            if (OnCreateValueAtLeaf) {
                currentTree.after(0);
                await OnCreateValueAtLeaf(currentTree, currentNode, value);
            }
            return currentNode;
        }

        await sd.pause();

        const mid = (l + r) >> 1;
        if (position <= mid) {
            if (lastNode && lastNode.right_child) {
                let current = currentNode;
                if (VirtualRightChild) {
                    currentTree.startAnimate();
                    currentTree.newNode(++virtualId, lastNode.right_child.my_id);
                    const virtualRC = currentTree.element(virtualId);
                    currentNode.virtual_right_child = virtualRC;
                    currentTree.rightChild(currentNodeId, virtualId);
                    currentTree.endAnimate();
                    virtualRC.background().after(0).strokeDashArray([5, 5]).stroke(C.grey);
                    current = virtualRC;
                }
                if (OnHistoryRightChildLink) {
                    await OnHistoryRightChildLink(current, lastNode.right_child);
                }
            }
            currentNode.left_child = await Dfs(currentNodeId, "leftChild", lastNode?.left_child, l, mid, position);
        } else {
            if (lastNode && lastNode.left_child) {
                let current = currentNode;
                if (VirtualLeftChild) {
                    currentTree.startAnimate();
                    currentTree.newNode(++virtualId, lastNode.left_child.my_id);
                    const virtualLC = currentTree.element(virtualId);
                    currentNode.virtual_left_child = virtualLC;
                    currentTree.leftChild(currentNodeId, virtualId);
                    currentTree.endAnimate();
                    virtualLC.background().after(0).strokeDashArray([5, 5]).stroke(C.grey);
                    current = virtualLC;
                }
                if (OnHistoryLeftChildLink) {
                    await OnHistoryLeftChildLink(current, lastNode.left_child);
                }
            }
            currentNode.right_child = await Dfs(currentNodeId, "rightChild", lastNode?.right_child, mid + 1, r, position);
        }
        return currentNode;
    }

    await Dfs(undefined, undefined, lastTree?.root(), 1, n, position);
    return currentTree;
}

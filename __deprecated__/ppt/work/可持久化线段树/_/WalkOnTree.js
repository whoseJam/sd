import * as sd from "@/sd";

/**
 * @param {sd.BinaryTree} tree 
 * @param {{
 *  OnEnterNode: (tree: sd.BinaryTree, node: sd.SDNode) => void
 *  OnEnterVirtualNode: (tree: sd.BinaryTree, node: sd.SDNode) => void
 *  OnExitNode: (tree: sd.BinaryTree, node: sd.SDNode) => void
 *  OnExitVirtualNode: (tree: sd.BinaryTree, node: sd.SDNode) => void
 *  OnEnterLeaf: (tree: sd.BinaryTree, node: sd.SDNode) => void
 * }} args
 */
export async function WalkOnTree(tree, args) {
    const OnEnterNode = args.OnEnterNode;
    const OnEnterVirtualNode = args.OnEnterVirtualNode;
    const OnExitNode = args.OnExitNode;
    const OnExitVirtualNode = args.OnExitVirtualNode;
    const OnEnterLeaf = args.OnEnterLeaf;

    async function Dfs(currentNode) {
        
        if (OnEnterNode) {
            await OnEnterNode(tree, currentNode);
        }

        if (currentNode.left_child) {
            if (OnEnterVirtualNode && currentNode.virtual_left_child) {
                await OnEnterVirtualNode(tree, currentNode.virtual_left_child);
            }
            await Dfs(currentNode.left_child);
            if (OnExitVirtualNode && currentNode.virtual_left_child) {
                await OnExitVirtualNode(tree, currentNode.virtual_left_child);
            }
        }
        
        if (currentNode.right_child) {
            if (OnEnterVirtualNode && currentNode.virtual_right_child) {
                await OnEnterVirtualNode(tree, currentNode.virtual_right_child);
            }
            await Dfs(currentNode.right_child);
            if (OnExitVirtualNode && currentNode.virtual_right_child) {
                await OnExitVirtualNode(tree, currentNode.virtual_right_child);
            }
        }
        
        if (!currentNode.left_child && !currentNode.right_child && OnEnterLeaf) {
            await OnEnterLeaf(tree, currentNode);
        }

        if (OnExitNode) {
            await OnExitNode(tree, currentNode);
        }
    }

    await Dfs(tree.root());
} 
import * as sd from "@/sd";

/**
 * 
 * @param {sd.BinaryTree} tree1 
 * @param {sd.BinaryTree} tree2
 * @param {{
 *  OnFocusRoot: (node1: sd.SDNode, node2: sd.SDNode, rt1: number|string, rt2: number|string) => void
 *  OnRemoveFocusRoot: (node1: sd.SDNode, node2: sd.SDNode, rt1: number|string, rt2: number|string) => void
 *  OnMergeLeftChild: (rt1: number|string, rt2: number|string, lc1: number|string|undefined, lc2: number|string|undefined) => void
 *  OnMergeRightChild: (rt1: number|string, rt2: number|string, rc1: number|string|undefined, rc2: number|string|undefined) => void
 *  OnFinishMergeLeftChild: (rt1: number|string, rt2: number|string, lc1: number|string|undefined, lc2: number|string|undefined) => void
 *  OnFinishMergeRightChild: (rt1: number|string, rt2: number|string, rc1: number|string|undefined, rc2: number|string|undefined) => void
 * }} args
 */
export async function MergeSegmentTree(tree1, tree2, args) {
    const OnFocusRoot = args.OnFocusRoot;
    const OnRemoveFocusRoot = args.OnRemoveFocusRoot;
    const OnMergeLeftChild = args.OnMergeLeftChild;
    const OnMergeRightChild = args.OnMergeRightChild;
    const OnFinishMergeLeftChild = args.OnFinishMergeLeftChild;
    const OnFinishMergeRightChild = args.OnFinishMergeRightChild;

    async function Merge(rt1, rt2) {
        if (OnFocusRoot) {
            await OnFocusRoot(
                tree1.element(rt1),
                tree2.element(rt2),
                rt1, rt2);
        }
        const lc1 = tree1.leftChildId(rt1);
        const lc2 = tree2.leftChildId(rt2);
        const rc1 = tree1.rightChildId(rt1);
        const rc2 = tree2.rightChildId(rt2);
       
        if (OnMergeLeftChild) {
            await OnMergeLeftChild(rt1, rt2, lc1, lc2);
        }
        if (lc1 && lc2) await Merge(lc1, lc2);
        if (OnFinishMergeLeftChild) {
            await OnFinishMergeLeftChild(rt1, rt2, lc1, lc2);
        }
       
        if (OnMergeRightChild) {
            await OnMergeRightChild(rt1, rt2, rc1, rc2);
        }
        if (rc1 && rc2) await Merge(rc1, rc2);
        if (OnFinishMergeRightChild) {
            await OnFinishMergeRightChild(rt1, rt2, rc1, rc2);
        }

        if (OnRemoveFocusRoot) {
            await OnRemoveFocusRoot(
                tree1.element(rt1),
                tree2.element(rt2),
                rt1, rt2);
        }
    }

    await Merge(tree1.rootId(), tree2.rootId())
}
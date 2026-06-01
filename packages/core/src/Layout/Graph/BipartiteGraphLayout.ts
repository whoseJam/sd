import type { SDNode } from "@/Node/SDNode";

/**
 * Layout function for arranging nodes in a bipartite graph pattern.
 *
 * This function positions nodes in two horizontal groups (type 0 and type 1),
 * with type 0 nodes aligned at the top and type 1 nodes aligned at the bottom.
 * Nodes within each group are evenly distributed horizontally.
 *
 * @param nodes - Array of nodes to be arranged
 * @param links - Array of links (edges) connecting the nodes
 * @param args - Layout configuration parameters
 * @param args.x - Left boundary of the layout area
 * @param args.y - Top boundary of the layout area
 * @param args.width - Width of the layout area
 * @param args.height - Height of the layout area
 * @param args.no - Map of node IDs to their type (0 or 1)
 * @param args.getNodeId - Function to get the ID of a node
 * @param args.getLinkSourceId - Function to get the source node ID from a link
 * @param args.getLinkTargetId - Function to get the target node ID from a link

 *
 * Layout behavior:
 * - Type 0 nodes: Positioned at y (top), evenly spaced horizontally
 * - Type 1 nodes: Positioned at y + height (bottom), evenly spaced horizontally
 * - Horizontal spacing is calculated to distribute nodes evenly across the width
 *
 * @example
 * // Create a bipartite graph with 3 nodes on top and 2 on bottom
 * const no = {
 *   [node1.nodeId]: 0,
 *   [node2.nodeId]: 0,
 *   [node3.nodeId]: 0,
 *   [node4.nodeId]: 1,
 *   [node5.nodeId]: 1
 * };
 * BipartiteGraphLayout([node1, node2, node3, node4, node5], links, {
 *   x: 0,
 *   y: 0,
 *   width: 600,
 *   height: 250,
 *   no: no,
 *   getNodeId: (node) => node.nodeId,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 *
 * @example
 * // Create a bipartite graph with custom node IDs
 * const no = {
 *   "A": 0,
 *   "B": 0,
 *   "C": 1,
 *   "D": 1
 * };
 * BipartiteGraphLayout([nodeA, nodeB, nodeC, nodeD], links, {
 *   x: 100,
 *   y: 100,
 *   width: 400,
 *   height: 200,
 *   no: no,
 *   getNodeId: (node) => node.customId,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 */
export function BipartiteGraphLayout(
  nodes: SDNode[],
  links: any[],
  args: {
    x: number;
    y: number;
    width: number;
    height: number;
    no: { [key: string]: 0 | 1 };
    getNodeId: (node: SDNode) => string | number;
    getLinkSourceId: (link: any) => string | number;
    getLinkTargetId: (link: any) => string | number;
  },
) {
  const {
    x,
    y,
    width,
    height,
    no,
    getNodeId,
    getLinkSourceId,
    getLinkTargetId,
  } = args;

  const orderedNodes: SDNode[] = [];
  const count = [0, 0];
  const currentIndex = [1, 1];

  // Count nodes in each group
  for (const node of nodes) {
    const id = String(getNodeId(node));
    orderedNodes.push(node);
    count[no[id]]++;
  }

  const mx = x + width;
  const my = y + height;
  const gap = [(mx - x) / (count[0] + 1), (mx - x) / (count[1] + 1)];

  const position = (id: string) => {
    return x + gap[no[id]] * currentIndex[no[id]];
  };

  // Position each node
  for (const node of orderedNodes) {
    const id = String(getNodeId(node));
    const xPos = position(id);
    const yPos = no[id] === 0 ? y : my;

    node.cx(xPos).cy(yPos);
    currentIndex[no[id]]++;
  }
}

import type { BoxNode } from "@sd/core";

/**
 * Layout function for arranging nodes in a grid pattern based on custom positions.
 *
 * This function positions nodes in a grid where each node has a specific (i, j) coordinate.
 * The grid is defined by n rows and m columns, and nodes are placed according to their
 * assigned positions in the pos map.
 *
 * @param nodes - Array of nodes to be arranged
 * @param links - Array of links (edges) connecting the nodes
 * @param args - Layout configuration parameters
 * @param args.x - Left boundary of the layout area
 * @param args.y - Top boundary of the layout area
 * @param args.width - Width of the layout area
 * @param args.height - Height of the layout area
 * @param args.n - Number of rows in the grid
 * @param args.m - Number of columns in the grid
 * @param args.pos - Map of node IDs to their grid positions {x: row, y: column}
 * @param args.getNodeId - Function to get the ID of a node
 * @param args.getLinkSourceId - Function to get the source node ID from a link
 * @param args.getLinkTargetId - Function to get the target node ID from a link

 *
 * The grid divides the layout area into n×m cells, and each node is centered
 * in its assigned cell based on the pos mapping.
 *
 * @example
 * // Create a 3×3 grid with nodes at specific positions
 * const pos = {
 *   [node1.nodeId]: { x: 0, y: 0 },  // Top-left
 *   [node2.nodeId]: { x: 1, y: 1 },  // Center
 *   [node3.nodeId]: { x: 2, y: 2 }   // Bottom-right
 * };
 * GridGraphLayout([node1, node2, node3], links, {
 *   x: 0,
 *   y: 0,
 *   width: 300,
 *   height: 300,
 *   n: 3,
 *   m: 3,
 *   pos: pos,
 *   getNodeId: (node) => node.nodeId,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 *
 * @example
 * // Create a 2×4 grid
 * const pos = {
 *   [node1.nodeId]: { x: 0, y: 0 },
 *   [node2.nodeId]: { x: 0, y: 1 },
 *   [node3.nodeId]: { x: 1, y: 2 },
 *   [node4.nodeId]: { x: 1, y: 3 }
 * };
 * GridGraphLayout([node1, node2, node3, node4], links, {
 *   x: 100,
 *   y: 100,
 *   width: 400,
 *   height: 200,
 *   n: 2,
 *   m: 4,
 *   pos: pos,
 *   getNodeId: (node) => node.nodeId,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 */
export function GridGraphLayout<TLink>(
  nodes: Array<BoxNode>,
  links: Array<TLink>,
  args: {
    x: number;
    y: number;
    width: number;
    height: number;
    n: number;
    m: number;
    pos: { [key: string | number]: { x: number; y: number } };
    getNodeId: (node: BoxNode) => string | number;
    getLinkSourceId: (link: TLink) => string | number;
    getLinkTargetId: (link: TLink) => string | number;
  },
) {
  const { x, y, width, height, n, m, pos, getNodeId } = args;

  const mx = x + width;
  const my = y + height;
  const w = (mx - x) / m;
  const h = (my - y) / n;

  const position = (node: BoxNode): [number, number] => {
    const nodeId = getNodeId(node);
    const nodePos = pos[nodeId];
    return [nodePos.y * w + x + w / 2, nodePos.x * h + y + h / 2];
  };

  for (const node of nodes) {
    const [cx, cy] = position(node);
    node.setCx(cx).setCy(cy);
  }
}

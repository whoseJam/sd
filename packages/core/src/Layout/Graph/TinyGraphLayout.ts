import { SDNode } from "@/Node/SDNode";

/**
 * Layout function for arranging a small number of nodes (1-6) in predefined patterns.
 *
 * This function provides optimized layouts for tiny graphs with 1 to 6 nodes.
 * Each node count has a specific arrangement pattern designed for visual clarity.
 *
 * @param nodes - Array of nodes to be arranged (1-6 nodes)
 * @param links - Array of links (edges) connecting the nodes
 * @param args - Layout configuration parameters
 * @param args.x - Left boundary of the layout area
 * @param args.y - Top boundary of the layout area
 * @param args.width - Width of the layout area
 * @param args.height - Height of the layout area
 * @param args.getNodeId - Function to get the ID of a node
 * @param args.getLinkSourceId - Function to get the source node ID from a link
 * @param args.getLinkTargetId - Function to get the target node ID from a link

 *
 * Layout patterns:
 * - 1 node: Centered
 * - 2 nodes: Horizontal line, evenly spaced
 * - 3 nodes: Triangle (1 top, 2 bottom)
 * - 4 nodes: Rectangle corners
 * - 5 nodes: Rectangle corners + center
 * - 6 nodes: Hexagon pattern
 *
 * @example
 * // Layout 3 nodes in a triangle
 * TinyGraphLayout([node1, node2, node3], links, {
 *   x: 100,
 *   y: 100,
 *   width: 300,
 *   height: 300,
 *   getNodeId: (node) => node.id,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 *
 * @example
 * // Layout 5 nodes (4 corners + center)
 * TinyGraphLayout([node1, node2, node3, node4, node5], links, {
 *   x: 0,
 *   y: 0,
 *   width: 400,
 *   height: 400,
 *   getNodeId: (node) => node.id,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });

 */
export function TinyGraphLayout(
    nodes: SDNode[],
    links: any[],
    args: {
        x: number;
        y: number;
        width: number;
        height: number;
        getNodeId: (node: SDNode) => string | number;
        getLinkSourceId: (link: any) => string | number;
        getLinkTargetId: (link: any) => string | number;
    }
) {
    const { x, y, width, height, getNodeId, getLinkSourceId, getLinkTargetId } = args;

    const cx = x + width / 2;
    const cy = y + height / 2;
    const mx = x + width;
    const my = y + height;

    const update = updateMap[nodes.length];
    if (update) {
        update(nodes, { x, y, cx, cy, mx, my, width, height });
    }
}

const updateMap: Record<
    number,
    (
        nodes: SDNode[],
        bounds: { x: number; y: number; cx: number; cy: number; mx: number; my: number; width: number; height: number }
    ) => void
> = {
    1: function (nodes, bounds) {
        nodes[0].cx(bounds.cx).cy(bounds.cy);
    },
    2: function (nodes, bounds) {
        const w = bounds.width / 4;
        nodes[0].cx(bounds.x + w).cy(bounds.cy);
        nodes[1].cx(bounds.mx - w).cy(bounds.cy);
    },
    3: function (nodes, bounds) {
        const w = bounds.width / 4;
        const h = bounds.height / 4;
        nodes[0].cx(bounds.cx).cy(bounds.y + h);
        nodes[1].cx(bounds.x + w).cy(bounds.my - h);
        nodes[2].cx(bounds.mx - w).cy(bounds.my - h);
    },
    4: function (nodes, bounds) {
        const w = bounds.width / 4;
        const h = bounds.height / 4;
        nodes[0].cx(bounds.x + w).cy(bounds.y + h);
        nodes[1].cx(bounds.x + w).cy(bounds.my - h);
        nodes[2].cx(bounds.mx - w).cy(bounds.my - h);
        nodes[3].cx(bounds.mx - w).cy(bounds.y + h);
    },
    5: function (nodes, bounds) {
        const w = bounds.width / 4;
        const h = bounds.height / 4;
        nodes[0].cx(bounds.x + w).cy(bounds.y + h);
        nodes[1].cx(bounds.x + w).cy(bounds.my - h);
        nodes[2].cx(bounds.mx - w).cy(bounds.my - h);
        nodes[3].cx(bounds.mx - w).cy(bounds.y + h);
        nodes[4].cx(bounds.cx).cy(bounds.cy);
    },
    6: function (nodes, bounds) {
        const w = bounds.width / 4;
        const h = bounds.height / 4;
        nodes[0].cx(bounds.cx).cy(bounds.y + h / 2);
        nodes[1].cx(bounds.x + w / 2).cy(bounds.y + h);
        nodes[2].cx(bounds.x + w / 2).cy(bounds.my - h);
        nodes[3].cx(bounds.cx).cy(bounds.my - h / 2);
        nodes[4].cx(bounds.mx - w / 2).cy(bounds.my - h);
        nodes[5].cx(bounds.mx - w / 2).cy(bounds.y + h);
    },
};

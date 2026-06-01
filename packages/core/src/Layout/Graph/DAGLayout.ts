import { layout as DAGLayoutEngine, graphlib as DAGLib } from "dagre";

import type { SDNode } from "@/Node/SDNode";

import { mapTo } from "@/Math/Math";

type Align = "UL" | "UR" | "DL" | "DR" | "C";
type Direction = "TB" | "BT" | "LR" | "RL";

/**
 * Interface for defining edges in the DAG.
 * This is a generic interface - the actual link object can have any structure.
 */
export interface DAGLink {
  [key: string]: any;
}

/**
 * Layout function for arranging nodes in a Directed Acyclic Graph (DAG) pattern.
 *
 * This function uses the Dagre library to compute hierarchical layouts for DAGs.
 * It supports different directions (top-to-bottom, bottom-to-top, left-to-right, right-to-left)
 * and alignment options.
 *
 * @param nodes - Array of nodes to be arranged
 * @param links - Array of links (edges) connecting the nodes
 * @param args - Layout configuration parameters
 * @param args.x - Left boundary of the layout area
 * @param args.y - Top boundary of the layout area
 * @param args.width - Width of the layout area
 * @param args.height - Height of the layout area
 * @param args.direction - Layout direction: "TB" (top-bottom), "BT" (bottom-top), "LR" (left-right), "RL" (right-left)
 * @param args.align - Alignment within ranks: "UL" (up-left), "UR" (up-right), "DL" (down-left), "DR" (down-right), "C" (center)
 * @param args.getNodeId - Function to get the ID of a node
 * @param args.getLinkSourceId - Function to get the source node ID from a link
 * @param args.getLinkTargetId - Function to get the target node ID from a link
 * @param args.nodeWidth - Width of each node (default: 50)
 * @param args.nodeHeight - Height of each node (default: 50)
 * @param args.rankSep - Separation between ranks (default: 50)
 * @param args.nodeSep - Separation between nodes in the same rank (default: 50)

 *
 * The function:
 * 1. Creates an internal Dagre graph structure
 * 2. Adds all nodes and edges to the graph
 * 3. Configures the graph with direction and alignment settings
 * 4. Computes the DAG layout using Dagre
 * 5. Maps the computed positions to the specified layout area
 * 6. Positions each node at its computed location
 *
 * @example
 * // Create a top-to-bottom DAG layout with simple link structure
 * const links = [
 *   { source: "1", target: "2" },
 *   { source: "1", target: "3" },
 *   { source: "2", target: "4" }
 * ];
 *
 * DAGLayout([node1, node2, node3, node4], links, {
 *   x: 0,
 *   y: 0,
 *   width: 300,
 *   height: 300,
 *   direction: "TB",
 *   align: "C",
 *   getNodeId: (node) => node.nodeId,
 *   getLinkSourceId: (link) => link.source,
 *   getLinkTargetId: (link) => link.target
 * });
 *
 * @example
 * // Create a left-to-right DAG layout with custom link structure
 * const links = [
 *   { from: 1, to: 2 },
 *   { from: 2, to: 3 },
 *   { from: 3, to: 4 }
 * ];
 *
 * DAGLayout([node1, node2, node3, node4], links, {
 *   x: 100,
 *   y: 100,
 *   width: 400,
 *   height: 200,
 *   direction: "LR",
 *   align: "UL",
 *   getNodeId: (node) => node.customId,
 *   getLinkSourceId: (link) => link.from,
 *   getLinkTargetId: (link) => link.to,
 *   nodeWidth: 60,
 *   nodeHeight: 40,
 *   rankSep: 80,
 *   nodeSep: 40
 * });

 */
export function DAGLayout(
  nodes: SDNode[],
  links: DAGLink[],
  args: {
    x: number;
    y: number;
    width: number;
    height: number;
    direction?: Direction;
    align?: Align;
    getNodeId: (node: SDNode) => string | number;
    getLinkSourceId: (link: DAGLink) => string | number;
    getLinkTargetId: (link: DAGLink) => string | number;
    nodeWidth?: number;
    nodeHeight?: number;
    rankSep?: number;
    nodeSep?: number;
  },
) {
  const {
    x,
    y,
    width,
    height,
    direction = "TB",
    align = "C",
    getNodeId,
    getLinkSourceId,
    getLinkTargetId,
    nodeWidth = 50,
    nodeHeight = 50,
    rankSep = 50,
    nodeSep = 50,
  } = args;

  // Create internal Dagre graph
  const graph = new DAGLib.Graph();

  // Configure graph settings
  graph.setGraph({
    rankdir: direction,
    align: align,
    ranksep: rankSep,
    nodesep: nodeSep,
  });

  // Set default edge label
  graph.setDefaultEdgeLabel(() => ({}));

  // Add all nodes to the graph
  for (const node of nodes) {
    const id = String(getNodeId(node));
    graph.setNode(id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  }

  // Add all edges to the graph
  for (const link of links) {
    const sourceId = String(getLinkSourceId(link));
    const targetId = String(getLinkTargetId(link));
    graph.setEdge(sourceId, targetId);
  }

  // Compute layout
  DAGLayoutEngine(graph);

  // Get bounding box of the computed layout
  const box = toBox(graph);

  // Create mappers to transform from Dagre coordinates to target coordinates
  const mapperX = mapTo(box.x, box.width, x, width);
  const mapperY = mapTo(box.y, box.height, y, height);

  const position = (layout: any): [number, number] => {
    return [mapperX(layout.x), mapperY(layout.y)];
  };

  // Position each node
  for (const node of nodes) {
    const id = String(getNodeId(node));
    const layout = graph.node(id);
    if (layout) {
      const [cx, cy] = position(layout);
      node.cx(cx).cy(cy);
    }
  }
}

/**
 * Helper function to compute the bounding box of a Dagre graph layout.
 */
function toBox(graph: DAGLib.Graph) {
  let x: number, mx: number, y: number, my: number;

  graph.nodes().forEach(function (info) {
    const layout = graph.node(info);
    if (x === undefined) {
      x = mx = layout.x;
      y = my = layout.y;
    } else {
      x = Math.min(x, layout.x);
      mx = Math.max(mx, layout.x);
      y = Math.min(y, layout.y);
      my = Math.max(my, layout.y);
    }
  });

  if (x === undefined) x = mx = y = my = 0;
  return { x, y, width: mx - x, height: my - y };
}

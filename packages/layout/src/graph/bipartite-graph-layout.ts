import type { BoxNode } from "@sd/core";

export function BipartiteGraphLayout<TLink>(
  nodes: Array<BoxNode>,
  links: Array<TLink>,
  args: {
    x: number;
    y: number;
    width: number;
    height: number;
    no: { [key: string]: 0 | 1 };
    getNodeId: (node: BoxNode) => string | number;
    getLinkSourceId: (link: TLink) => string | number;
    getLinkTargetId: (link: TLink) => string | number;
  },
) {
  const { x, y, width, height, no, getNodeId } = args;

  const orderedNodes: Array<BoxNode> = [];
  const count = [0, 0];
  const currentIndex = [1, 1];

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

  for (const node of orderedNodes) {
    const id = String(getNodeId(node));
    const xPos = position(id);
    const yPos = no[id] === 0 ? y : my;

    node.setCx(xPos).setCy(yPos);
    currentIndex[no[id]]++;
  }
}

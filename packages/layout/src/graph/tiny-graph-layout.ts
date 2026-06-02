import type { BoxNode } from "@sd/core";

export function TinyGraphLayout<TLink>(
  nodes: Array<BoxNode>,
  links: Array<TLink>,
  args: {
    x: number;
    y: number;
    width: number;
    height: number;
    getNodeId: (node: BoxNode) => string | number;
    getLinkSourceId: (link: TLink) => string | number;
    getLinkTargetId: (link: TLink) => string | number;
  },
) {
  const { x, y, width, height } = args;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const mx = x + width;
  const my = y + height;

  const update = updateMap[nodes.length];
  if (update) {
    update(nodes, { x, y, cx, cy, mx, my, width, height });
  }
}

type Bounds = {
  x: number;
  y: number;
  cx: number;
  cy: number;
  mx: number;
  my: number;
  width: number;
  height: number;
};

const updateMap: Record<
  number,
  (nodes: Array<BoxNode>, bounds: Bounds) => void
> = {
  1: function (nodes, bounds) {
    nodes[0].setCx(bounds.cx).setCy(bounds.cy);
  },
  2: function (nodes, bounds) {
    const w = bounds.width / 4;
    nodes[0].setCx(bounds.x + w).setCy(bounds.cy);
    nodes[1].setCx(bounds.mx - w).setCy(bounds.cy);
  },
  3: function (nodes, bounds) {
    const w = bounds.width / 4;
    const h = bounds.height / 4;
    nodes[0].setCx(bounds.cx).setCy(bounds.y + h);
    nodes[1].setCx(bounds.x + w).setCy(bounds.my - h);
    nodes[2].setCx(bounds.mx - w).setCy(bounds.my - h);
  },
  4: function (nodes, bounds) {
    const w = bounds.width / 4;
    const h = bounds.height / 4;
    nodes[0].setCx(bounds.x + w).setCy(bounds.y + h);
    nodes[1].setCx(bounds.x + w).setCy(bounds.my - h);
    nodes[2].setCx(bounds.mx - w).setCy(bounds.my - h);
    nodes[3].setCx(bounds.mx - w).setCy(bounds.y + h);
  },
  5: function (nodes, bounds) {
    const w = bounds.width / 4;
    const h = bounds.height / 4;
    nodes[0].setCx(bounds.x + w).setCy(bounds.y + h);
    nodes[1].setCx(bounds.x + w).setCy(bounds.my - h);
    nodes[2].setCx(bounds.mx - w).setCy(bounds.my - h);
    nodes[3].setCx(bounds.mx - w).setCy(bounds.y + h);
    nodes[4].setCx(bounds.cx).setCy(bounds.cy);
  },
  6: function (nodes, bounds) {
    const w = bounds.width / 4;
    const h = bounds.height / 4;
    nodes[0].setCx(bounds.cx).setCy(bounds.y + h / 2);
    nodes[1].setCx(bounds.x + w / 2).setCy(bounds.y + h);
    nodes[2].setCx(bounds.x + w / 2).setCy(bounds.my - h);
    nodes[3].setCx(bounds.cx).setCy(bounds.my - h / 2);
    nodes[4].setCx(bounds.mx - w / 2).setCy(bounds.my - h);
    nodes[5].setCx(bounds.mx - w / 2).setCy(bounds.y + h);
  },
};

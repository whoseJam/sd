import type { BoxNode } from "@sd/core";

type Align = "x" | "cx" | "mx" | "y" | "cy" | "my";
type Axis = "row" | "col";

interface GridLayoutParam {
  x: number;
  y: number;
  elementWidth: number;
  elementHeight: number;
  elements: Array<Array<BoxNode>>;
  m: number;
  axis?: Axis;
  align?: Align;
}

export function GridLayout(args: GridLayoutParam) {
  const {
    x,
    y,
    elementWidth,
    elementHeight,
    elements,
    m,
    axis = "row",
    align = "x",
  } = args;

  const dict = {
    x: x,
    y: y,
    mx: x + elementWidth * m,
    my: y + elementHeight * elements.length,
    lx: elementWidth,
    ly: elementHeight,
  };

  const mainAxis = axis === "row" ? "y" : "x";
  const auxiAxis = axis === "row" ? "x" : "y";

  const offset =
    align === "x" || align === "y"
      ? offsetN
      : align === "cx" || align === "cy"
        ? offsetC
        : offsetM;

  for (let i = 0; i < elements.length; i++) {
    if (!elements[i]) continue;

    for (let j = 0; j < elements[i].length; j++) {
      const element = elements[i][j];
      if (!element) continue;

      setAxis(element, mainAxis, dict[mainAxis] + i * dict[`l${mainAxis}`]);
      setAxis(
        element,
        auxiAxis,
        dict[auxiAxis] +
          (offset(m, elements[i].length) + j) * dict[`l${auxiAxis}`],
      );
    }
  }
}

function setAxis(node: BoxNode, axis: "x" | "y", v: number) {
  if (axis === "x") node.setX(v);
  else node.setY(v);
}

function offsetN() {
  return 0;
}

function offsetC(m: number, length: number) {
  return (m - length) / 2;
}

function offsetM(m: number, length: number) {
  return m - length;
}

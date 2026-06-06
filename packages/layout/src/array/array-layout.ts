import type { BoxNode } from "@sd/core";

type Align = "y" | "cy" | "my";
type Justify = "x" | "cx" | "mx";

interface ArrayLayoutParam {
  x: number;
  y: number;
  elementWidth: number;
  align?: Align;
  justify?: Justify;
}

export function ArrayLayout(arr: Array<BoxNode>, args: ArrayLayoutParam) {
  const { x, y, elementWidth, align = "cy", justify = "cx" } = args;

  arr.forEach((element, i) => {
    if (justify === "x") {
      element.setX(x + elementWidth * i);
    } else if (justify === "cx") {
      element.setCx(x + elementWidth * (i + 0.5));
    } else {
      element.setMaxX(x + elementWidth * (i + 1));
    }

    if (align === "y") {
      element.setY(y);
    } else if (align === "cy") {
      element.setCy(y);
    } else {
      element.setMaxY(y);
    }
  });
}

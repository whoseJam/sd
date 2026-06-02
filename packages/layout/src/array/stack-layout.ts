import type { BoxNode } from "@sd/core";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

interface StackLayoutParam {
  x: number;
  y: number;
  elementHeight: number;
  align?: Align;
  justify?: Justify;
}

export function StackLayout(arr: Array<BoxNode>, args: StackLayoutParam) {
  const { x, y, elementHeight, align = "cx", justify = "cy" } = args;

  arr.forEach((element, i) => {
    if (justify === "y") {
      element.setY(y + elementHeight * i);
    } else if (justify === "cy") {
      element.setCy(y + elementHeight * (i + 0.5));
    } else {
      element.setMy(y + elementHeight * (i + 1));
    }

    if (align === "x") {
      element.setX(x);
    } else if (align === "cx") {
      element.setCx(x);
    } else {
      element.setMx(x);
    }
  });
}

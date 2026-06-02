import type { BoxNode } from "@sd/core";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

interface PileLayoutParam {
  x: number;
  my: number;
  elementHeight: number;
  align?: Align;
  justify?: Justify;
}

export function PileLayout(arr: Array<BoxNode>, args: PileLayoutParam) {
  const { x, my, elementHeight, align = "cx", justify = "cy" } = args;

  arr.forEach((element, i) => {
    if (justify === "my") {
      element.setMy(my - elementHeight * i);
    } else if (justify === "cy") {
      element.setCy(my - elementHeight * (i + 0.5));
    } else {
      element.setY(my - elementHeight * (i + 1));
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

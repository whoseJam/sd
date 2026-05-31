import type { SDNode } from "@/Node/SDNode";

type Align = "y" | "cy" | "my";
type Justify = "x" | "cx" | "mx";

interface ArrayLayoutParam {
  x: number;
  y: number;
  elementWidth: number;
  align?: Align;
  justify?: Justify;
}

/**
 * Layout function for arranging array elements in a horizontal line.
 *
 * @param arr - Array of SDNode elements to layout
 * @param args - Layout parameters including position, size, and alignment
 *
 * Alignment options:
 * - align: "y" (top), "cy" (center), "my" (bottom) - vertical alignment
 * - justify: "x" (left), "cx" (center), "mx" (right) - horizontal justification within each cell
 *
 * @example
 * ArrayLayout(nodes, {
 *   x: 100,
 *   y: 200,
 *   elementWidth: 50,
 *   align: "cy",
 *   justify: "cx"
 * });
 */
export function ArrayLayout(arr: Array<SDNode>, args: ArrayLayoutParam) {
  const { x, y, elementWidth, align = "cy", justify = "cx" } = args;

  arr.forEach((element, i) => {
    if (justify === "x") {
      element.x(x + elementWidth * i);
    } else if (justify === "cx") {
      element.cx(x + elementWidth * (i + 0.5));
    } else {
      element.mx(x + elementWidth * (i + 1));
    }

    if (align === "y") {
      element.y(y);
    } else if (align === "cy") {
      element.cy(y);
    } else {
      element.my(y);
    }
  });
}

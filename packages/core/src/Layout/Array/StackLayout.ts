import type { SDNode } from "@/Node/SDNode";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

interface StackLayoutParam {
  x: number;
  y: number;
  elementHeight: number;
  align?: Align;
  justify?: Justify;
}

/**
 * Layout function for arranging stack elements in a vertical line.
 *
 * @param arr - Array of SDNode elements to layout
 * @param args - Layout parameters including position, size, and alignment
 *
 * Alignment options:
 * - align: "x" (left), "cx" (center), "mx" (right) - horizontal alignment
 * - justify: "y" (top), "cy" (center), "my" (bottom) - vertical justification within each cell
 *
 * @example
 * StackLayout(nodes, {
 *   x: 100,
 *   y: 200,
 *   elementHeight: 50,
 *   align: "cx",
 *   justify: "cy"
 * });
 */
export function StackLayout(arr: Array<SDNode>, args: StackLayoutParam) {
  const { x, y, elementHeight, align = "cx", justify = "cy" } = args;

  arr.forEach((element, i) => {
    // Calculate vertical position based on justify mode
    if (justify === "y") {
      // Top align: element starts at y + i * elementHeight
      element.y(y + elementHeight * i);
    } else if (justify === "cy") {
      // Center align: element center at y + (i + 0.5) * elementHeight
      element.cy(y + elementHeight * (i + 0.5));
    } else {
      // Bottom align: element ends at y + (i + 1) * elementHeight
      element.my(y + elementHeight * (i + 1));
    }

    // Calculate horizontal position based on align mode
    if (align === "x") {
      element.x(x);
    } else if (align === "cx") {
      element.cx(x);
    } else {
      element.mx(x);
    }
  });
}

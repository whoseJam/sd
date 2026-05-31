import type { SDNode } from "@/Node/SDNode";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

interface PileLayoutParam {
  x: number;
  my: number;
  elementHeight: number;
  align?: Align;
  justify?: Justify;
}

/**
 * Layout function for arranging pile elements in a vertical line from bottom to top.
 *
 * @param arr - Array of SDNode elements to layout
 * @param args - Layout parameters including position, size, and alignment
 *
 * Alignment options:
 * - align: "x" (left), "cx" (center), "mx" (right) - horizontal alignment
 * - justify: "y" (top), "cy" (center), "my" (bottom) - vertical justification within each cell
 *
 * Note: Unlike StackLayout which grows downward from y, PileLayout grows upward from my (bottom).
 *
 * @example
 * PileLayout(nodes, {
 *   x: 100,
 *   my: 500,
 *   elementHeight: 50,
 *   align: "cx",
 *   justify: "cy"
 * });
 */
export function PileLayout(arr: Array<SDNode>, args: PileLayoutParam) {
  const { x, my, elementHeight, align = "cx", justify = "cy" } = args;

  arr.forEach((element, i) => {
    // Calculate vertical position based on justify mode (growing upward from my)
    if (justify === "my") {
      // Bottom align: element ends at my - i * elementHeight
      element.my(my - elementHeight * i);
    } else if (justify === "cy") {
      // Center align: element center at my - (i + 0.5) * elementHeight
      element.cy(my - elementHeight * (i + 0.5));
    } else {
      // Top align: element starts at my - (i + 1) * elementHeight
      element.y(my - elementHeight * (i + 1));
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

import { SDNode } from "@/Node/SDNode";

type Align = "x" | "cx" | "mx" | "y" | "cy" | "my";
type Axis = "row" | "col";

interface GridLayoutParam {
    x: number;
    y: number;
    elementWidth: number;
    elementHeight: number;
    elements: Array<Array<SDNode>>;
    m: number;
    axis?: Axis;
    align?: Align;
}

/**
 * Layout function for arranging elements in a 2D grid.
 *
 * This function positions elements in a grid layout with configurable axis orientation
 * and alignment. It supports both row-major and column-major layouts.
 *
 * @param args - Layout parameters
 *
 * Parameters:
 * - x: X coordinate of the grid's top-left corner (required)
 * - y: Y coordinate of the grid's top-left corner (required)
 * - elementWidth: Width of each grid cell (required)
 * - elementHeight: Height of each grid cell (required)
 * - elements: 2D array of SDNode elements to layout (required)
 * - m: Number of columns (for row axis) or rows (for col axis) (required)
 * - axis: Primary layout direction - "row" (horizontal first) or "col" (vertical first) (default: "row")
 * - align: Alignment mode for secondary dimension (default: "x")
 *
 * Axis modes:
 * - "row": Elements are laid out horizontally first (row-major order)
 * - "col": Elements are laid out vertically first (column-major order)
 *
 * Alignment modes (depends on axis):
 * When axis is "row":
 * - "x": Align left
 * - "cx": Align center horizontally
 * - "mx": Align right
 *
 * When axis is "col":
 * - "y": Align top
 * - "cy": Align center vertically
 * - "my": Align bottom
 *
 * Algorithm:
 * 1. Determine main axis (row: vertical, col: horizontal) and auxiliary axis
 * 2. For each element at position [i, j]:
 *    - Main axis position: base + i * cellSize
 *    - Auxiliary axis position: base + (offset + j) * cellSize
 * 3. Offset is calculated based on alignment mode to center or right-align elements
 *
 * @example
 * // Basic row-major grid (3x5)
 * const elements = [
 *   [node1, node2, node3, node4, node5],
 *   [node6, node7, node8, node9, node10],
 *   [node11, node12, node13, node14, node15]
 * ];
 * GridLayout({
 *   x: 100,
 *   y: 100,
 *   elementWidth: 50,
 *   elementHeight: 50,
 *   elements: elements,
 *   m: 5,
 *   axis: "row",
 *   align: "x"
 * });
 *
 * @example
 * // Column-major grid with center alignment
 * GridLayout({
 *   x: 100,
 *   y: 100,
 *   elementWidth: 50,
 *   elementHeight: 50,
 *   elements: elements,
 *   m: 3,
 *   axis: "col",
 *   align: "cy"
 * });
 *
 * @example
 * // Row-major grid with right alignment
 * GridLayout({
 *   x: 100,
 *   y: 100,
 *   elementWidth: 50,
 *   elementHeight: 50,
 *   elements: elements,
 *   m: 5,
 *   axis: "row",
 *   align: "mx"
 * });
 *
 * @example
 * // Sparse grid (some cells may be undefined)
 * const sparseElements = [
 *   [node1, undefined, node3],
 *   [undefined, node5, node6],
 *   [node7, node8, undefined]
 * ];
 * GridLayout({
 *   x: 100,
 *   y: 100,
 *   elementWidth: 50,
 *   elementHeight: 50,
 *   elements: sparseElements,
 *   m: 3,
 *   axis: "row",
 *   align: "cx"
 * });
 */
export function GridLayout(args: GridLayoutParam) {
    const { x, y, elementWidth, elementHeight, elements, m, axis = "row", align = "x" } = args;

    // Calculate derived values
    const dict = {
        x: x,
        y: y,
        mx: x + elementWidth * m,
        my: y + elementHeight * elements.length,
        lx: elementWidth,
        ly: elementHeight,
    };

    // Determine main and auxiliary axes
    const mainAxis = axis === "row" ? "y" : "x";
    const auxiAxis = axis === "row" ? "x" : "y";

    // Select offset function based on alignment
    const offset = align === "x" || align === "y" ? offsetN : align === "cx" || align === "cy" ? offsetC : offsetM;

    // Layout each element
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i]) continue;

        for (let j = 0; j < elements[i].length; j++) {
            const element = elements[i][j];
            if (!element) continue;

            // Position element based on axis orientation
            element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
            element[auxiAxis](dict[auxiAxis] + (offset(m, elements[i].length) + j) * dict[`l${auxiAxis}`]);
        }
    }
}

/**
 * Helper function for left/top alignment (no offset)
 */
function offsetN() {
    return 0;
}

/**
 * Helper function for center alignment
 */
function offsetC(m: number, length: number) {
    return (m - length) / 2;
}

/**
 * Helper function for right/bottom alignment
 */
function offsetM(m: number, length: number) {
    return m - length;
}

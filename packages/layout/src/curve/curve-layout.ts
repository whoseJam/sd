import type { SDNode } from "@sd/core";
import type { Path } from "@sd/core";

import { Vector as V } from "@sd/core";
import { PathPen } from "@sd/core";
import { trim } from "@sd/core";

interface CurveLayoutArgs {
  source: [number, number];
  target: [number, number];
  bending?: number;
  sourceClipper?: SDNode;
  targetClipper?: SDNode;
}

/**
 * Layout function for creating a curved path between two points with adjustable bending.
 *
 * This function generates a smooth curved path using a single quadratic bezier curve.
 * The control point is positioned perpendicular to the line between source and target,
 * with the distance controlled by the bending parameter.
 *
 * @param path - The Path element to apply the curve to
 * @param args - Layout parameters
 *
 * Parameters:
 * - source: Source point coordinates [x, y] (required)
 * - target: Target point coordinates [x, y] (required)
 * - bending: Controls the curve intensity (default: 0.25). Positive values bend left, negative bend right
 * - sourceClipper: Optional SDNode to trim the curve at source
 * - targetClipper: Optional SDNode to trim the curve at target
 *
 * Algorithm:
 * 1. Calculate the direction vector from source to target
 * 2. Find the midpoint between source and target
 * 3. Calculate a perpendicular vector (left direction)
 * 4. Position the control point at: midpoint + perpendicular * distance * bending
 * 5. Create a quadratic bezier curve through these points
 *
 * @example
 * // Basic curved line with default bending
 * const path = sd.Path();
 * CurveLayout(path, {
 *   source: [100, 100],
 *   target: [300, 200]
 * });
 *
 * @example
 * // Stronger curve bending to the left
 * const path = sd.Path();
 * CurveLayout(path, {
 *   source: [100, 100],
 *   target: [300, 200],
 *   bending: 0.5
 * });
 *
 * @example
 * // Curve bending to the right (negative bending)
 * const path = sd.Path();
 * CurveLayout(path, {
 *   source: [100, 100],
 *   target: [300, 200],
 *   bending: -0.3
 * });
 *
 * @example
 * // With node clipping
 * const path = sd.Path();
 * CurveLayout(path, {
 *   source: [nodeA.cx(), nodeA.cy()],
 *   target: [nodeB.cx(), nodeB.cy()],
 *   bending: 0.25,
 *   sourceClipper: nodeA,
 *   targetClipper: nodeB
 * });
 */
export function CurveLayout(path: Path, args: CurveLayoutArgs) {
  const { source, target, bending = 0.25, sourceClipper, targetClipper } = args;

  // Generate curve path using the same algorithm as Curve class
  const v1 = source;
  const v2 = target;
  const d = V.sub(v2, v1);
  const dis = V.norm(d);
  const left = V.identity(V.rotate(d, Math.PI / 2));
  const vc = V.add(
    V.add(v1, V.numberMul(d, 0.5)),
    V.numberMul(left, dis * bending),
  );

  // Build the path string
  const pathString = new PathPen().MoveTo(v1).Quad(vc, v2).toString();

  // Set the path data
  path.setD(pathString);

  // Apply trimming if clippers are provided
  if (sourceClipper || targetClipper) {
    trim(path, sourceClipper, targetClipper);
  }
}

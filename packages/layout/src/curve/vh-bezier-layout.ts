import type { SDNode } from "@sd/core";
import type { Path } from "@sd/core";

import { Vector as V } from "@sd/core";
import { PathPen } from "@sd/core";
import { trim } from "@sd/core";

interface VHBezierLayoutArgs {
  source: [number, number];
  target: [number, number];
  sourceClipper?: SDNode;
  targetClipper?: SDNode;
}

/**
 * Layout function for creating a Vertical-Horizontal Bezier curve between two points.
 *
 * This function generates a smooth curve that transitions either vertically then horizontally,
 * or horizontally then vertically, depending on which dimension has a larger difference.
 * The curve uses two quadratic bezier segments.
 *
 * @param path - The Path element to apply the curve to
 * @param args - Layout parameters
 *
 * Parameters:
 * - source: Source point coordinates [x, y] (required)
 * - target: Target point coordinates [x, y] (required)
 * - sourceClipper: Optional SDNode to trim the curve at source
 * - targetClipper: Optional SDNode to trim the curve at target
 *
 * Algorithm:
 * 1. Calculate the difference vector between source and target
 * 2. If horizontal distance > vertical distance:
 *    - First control point moves horizontally from source
 *    - Second control point moves horizontally to target
 * 3. If vertical distance >= horizontal distance:
 *    - First control point moves vertically from source
 *    - Second control point moves vertically to target
 * 4. Create two quadratic bezier curves through these points
 *
 * This creates a natural "elbow" curve that follows axis-aligned paths.
 *
 * @example
 * // Basic VH Bezier curve
 * const path = sd.Path();
 * VHBezierLayout(path, {
 *   source: [100, 100],
 *   target: [300, 200]
 * });
 *
 * @example
 * // With node clipping
 * const path = sd.Path();
 * VHBezierLayout(path, {
 *   source: [nodeA.cx(), nodeA.cy()],
 *   target: [nodeB.cx(), nodeB.cy()],
 *   sourceClipper: nodeA,
 *   targetClipper: nodeB
 * });
 */
export function VHBezierLayout(path: Path, args: VHBezierLayoutArgs) {
  const { source, target, sourceClipper, targetClipper } = args;

  // Generate VH Bezier curve path using the same algorithm as VHBezier class
  const v1 = source;
  const v2 = target;
  const d = V.sub(v2, v1);
  let p1: [number, number];
  let p2: [number, number];
  let pm: [number, number];

  pm = V.add(v1, V.numberMul(d, 0.5));

  if (d[0] < d[1]) {
    // Vertical-first path
    p1 = [v1[0], v1[1] + d[1] * 0.5];
    p2 = [v2[0], v2[1] - d[1] * 0.5];
  } else {
    // Horizontal-first path
    p1 = [v1[0] + d[0] * 0.5, v1[1]];
    p2 = [v2[0] - d[0] * 0.5, v2[1]];
  }

  // Build the path string
  const pathString = new PathPen()
    .MoveTo(v1)
    .Quad(p1, pm)
    .Quad(p2, v2)
    .toString();

  // Set the path data
  path.d(pathString);

  // Apply trimming if clippers are provided
  if (sourceClipper || targetClipper) {
    trim(path, sourceClipper, targetClipper);
  }
}

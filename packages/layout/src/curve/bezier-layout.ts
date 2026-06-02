import type { SDNode } from "@sd/core";
import type { Path } from "@sd/core";

import { Vector as V } from "@sd/core";
import { PathPen } from "@sd/core";
import { trim } from "@sd/core";

interface BezierLayoutArgs {
  source: [number, number];
  target: [number, number];
  sourceClipper?: SDNode;
  targetClipper?: SDNode;
}

/**
 * Layout function for creating a Bezier curve path between two points with optional clipping.
 *
 * This function generates a smooth S-shaped Bezier curve using quadratic bezier segments,
 * and optionally trims the curve to avoid overlapping with source/target nodes.
 *
 * @param path - The Path element to apply the Bezier curve to
 * @param args - Layout parameters
 *
 * Parameters:
 * - source: Source point coordinates [x, y] (required)
 * - target: Target point coordinates [x, y] (required)
 * - sourceClipper: Optional SDNode to trim the curve at source (removes curve inside the node)
 * - targetClipper: Optional SDNode to trim the curve at target (removes curve inside the node)
 *
 * Algorithm:
 * The curve is generated using two quadratic bezier segments that create a smooth S-shape.
 * Control points are calculated based on the direction vector between source and target,
 * with perpendicular offsets to create the characteristic curve shape.
 *
 * Clipping behavior:
 * When clippers are provided, the `trim` function uses binary search to find where the
 * curve intersects with the node boundaries, effectively removing portions inside the nodes.
 *
 * @example
 * // Basic usage with explicit coordinates
 * const path = sd.Path();
 * BezierLayout(path, {
 *   source: [100, 100],
 *   target: [300, 200]
 * });
 *
 * @example
 * // With source clipping (curve starts at node boundary)
 * const path = sd.Path();
 * BezierLayout(path, {
 *   source: [nodeA.cx(), nodeA.cy()],
 *   target: [nodeB.cx(), nodeB.cy()],
 *   sourceClipper: nodeA
 * });
 *
 * @example
 * // With both source and target clipping (typical use case for node connections)
 * const path = sd.Path();
 * BezierLayout(path, {
 *   source: [nodeA.cx(), nodeA.cy()],
 *   target: [nodeB.cx(), nodeB.cy()],
 *   sourceClipper: nodeA,
 *   targetClipper: nodeB
 * });
 */

export function BezierLayout(path: Path, args: BezierLayoutArgs) {
  const { source, target, sourceClipper, targetClipper } = args;

  // Generate Bezier curve path using the same algorithm as Bezier class
  const v1 = source;
  const v2 = target;
  const d = V.sub(v2, v1);
  const d1q = V.numberMul(d, 0.25);
  const d3q = V.numberMul(d, 0.75);
  const pc1 = V.add(V.add(v1, d1q), V.rotate(d1q, Math.PI / 2));
  const pm = V.add(v1, V.numberMul(d, 0.5));
  const pc2 = V.add(V.add(v1, d3q), V.rotate(d1q, -Math.PI / 2));

  // Build the path string
  const pathString = new PathPen()
    .MoveTo(v1)
    .Quad(pc1, pm)
    .Quad(pc2, v2)
    .toString();

  // Set the path data
  path.setD(pathString);

  // Apply trimming if clippers are provided
  if (sourceClipper || targetClipper) {
    // todo
    trim(path, sourceClipper, targetClipper);
  }
}

import type { Path } from "@sd/core";
import type { SDNode } from "@sd/core";

import { Vector as V } from "@sd/core";
import { PathPen } from "@sd/core";
import { trim } from "@sd/core";

interface BraceLayoutArgs {
  source: [number, number];
  target: [number, number];
  bending?: number;
  sourceClipper?: SDNode;
  targetClipper?: SDNode;
}

/**
 * Layout function for creating a brace-shaped curve between two points.
 *
 * This function generates a decorative brace curve (like a curly bracket "{") that
 * connects two points. The curve has a distinctive shape with a center point that
 * extends perpendicular to the line between source and target.
 *
 * @param path - The Path element to apply the curve to
 * @param args - Layout parameters
 *
 * Parameters:
 * - source: Source point coordinates [x, y] (required)
 * - target: Target point coordinates [x, y] (required)
 * - bending: Controls the brace depth (default: 5). Higher values create deeper braces
 * - sourceClipper: Optional SDNode to trim the curve at source
 * - targetClipper: Optional SDNode to trim the curve at target
 *
 * Algorithm:
 * The brace is constructed using multiple bezier curves and lines:
 * 1. Calculate the midpoint and perpendicular direction
 * 2. Create control points that form the characteristic brace shape
 * 3. The curve extends outward from source, curves to center, then curves to target
 * 4. The bending parameter controls how far the center point extends
 *
 * The resulting shape resembles a curly brace "{" or "}" depending on orientation.
 *
 * @example
 * // Basic brace curve with default bending
 * const path = sd.Path();
 * BraceLayout(path, {
 *   source: [100, 100],
 *   target: [100, 300]
 * });
 *
 * @example
 * // Deeper brace curve
 * const path = sd.Path();
 * BraceLayout(path, {
 *   source: [100, 100],
 *   target: [100, 300],
 *   bending: 10
 * });
 *
 * @example
 * // Shallow brace curve
 * const path = sd.Path();
 * BraceLayout(path, {
 *   source: [100, 100],
 *   target: [100, 300],
 *   bending: 2
 * });
 *
 * @example
 * // With node clipping
 * const path = sd.Path();
 * BraceLayout(path, {
 *   source: [nodeA.cx(), nodeA.cy()],
 *   target: [nodeB.cx(), nodeB.cy()],
 *   bending: 5,
 *   sourceClipper: nodeA,
 *   targetClipper: nodeB
 * });
 */
export function BraceLayout(path: Path, args: BraceLayoutArgs) {
  const { source, target, bending = 5, sourceClipper, targetClipper } = args;

  // Generate brace curve path using the same algorithm as Brace class
  const vs = source;
  const vt = target;
  const vc = V.numberMul(V.add(vs, vt), 0.5);
  const d = V.numberMul(V.identity(V.sub(vt, vs)), bending);
  const dl = V.rotate(d, -Math.PI / 2);
  const p1 = V.add(vs, dl);
  const p2 = V.add(p1, d);
  const c2 = V.add(vc, dl);
  const c1 = V.sub(c2, d);
  const c3 = V.add(c2, d);
  const c = V.add(c2, dl);
  const p4 = V.add(vt, dl);
  const p3 = V.sub(p4, d);

  // Build the path string
  const pen = new PathPen();
  pen.MoveTo(vs).Quad(p1, p2);
  pen.LineTo(c1).Quad(c2, c).Quad(c2, c3);
  pen.LineTo(p3).Quad(p4, vt);
  const pathString = pen.toString();

  // Set the path data
  path.d(pathString);

  // Apply trimming if clippers are provided
  if (sourceClipper || targetClipper) {
    trim(path, sourceClipper, targetClipper);
  }
}

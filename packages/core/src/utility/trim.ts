import type { SDNode } from "@/node/node";
import type { BasePath } from "@/node/path/base-path";

/**
 * Trims the source end of the link path.
 * Uses binary search to find the point where the path exits the source node.
 *
 * @param link - The path to trim
 * @param source - The source node to trim from
 * @returns The normalized position (0-1) where trimming should start
 */
function trimSource(link: BasePath, source: SDNode | null | undefined): number {
  if (!source) return 0;
  let l = 0;
  let r = 1;
  while (r - l > 1e-3) {
    const mid = (l + r) / 2.0;
    if (source.inRange(link.at(mid))) l = mid;
    else r = mid;
  }
  if (link.totalLength() * l <= 1) return 0;
  return l;
}

/**
 * Trims the target end of the link path.
 * Uses binary search to find the point where the path enters the target node.
 *
 * @param link - The path to trim
 * @param target - The target node to trim to
 * @returns The normalized position (0-1) where trimming should end
 */
function trimTarget(link: BasePath, target: SDNode | null | undefined): number {
  if (!target) return 1;
  let l = 0;
  let r = 1;
  while (r - l > 1e-3) {
    const mid = (l + r) / 2.0;
    if (target.inRange(link.at(mid))) r = mid;
    else l = mid;
  }
  if (link.totalLength() * (1 - l) <= 1) return 1;
  return l;
}

/**
 * Trims a link path to avoid overlapping with source and target nodes.
 *
 * This function adjusts the start and end points of a path so that it doesn't
 * visually overlap with the source and target nodes it connects.
 *
 * @param link - The path to trim
 * @param source - The source node (optional)
 * @param target - The target node (optional)
 */
export function trim(
  link: BasePath,
  source: SDNode | null | undefined,
  target: SDNode | null | undefined,
): void {
  const s = trimSource(link, source);
  const t = trimTarget(link, target);
  const ls = link.at(s);
  const lt = link.at(t);
  // TO FIX
  link.source(ls);
  link.target(lt);
}

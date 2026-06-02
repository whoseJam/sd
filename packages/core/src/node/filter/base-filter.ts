import type { AABB } from "@/math/aabb";

import { SDSVGNode } from "@/node/svg-node";

// Filter primitives live in <defs> — they have no on-canvas footprint.
// Only the top-level Filter positions itself in user math space.
export class BaseFilter extends SDSVGNode {
  getLocalBox(): AABB {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
}

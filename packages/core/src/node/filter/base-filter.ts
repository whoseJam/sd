import { SDSVGNode } from "@/node/svg-node";

// Filter primitives don't position themselves in user math space; only
// the top-level Filter does, via its own x / y / width / height. The
// getX/getY/getWidth/getHeight here only exist to satisfy the abstracts
// inherited from SDNode and are never read off a primitive.
export class BaseFilter extends SDSVGNode {
  getX() {
    return 0;
  }

  getY() {
    return 0;
  }

  getWidth() {
    return 0;
  }

  getHeight() {
    return 0;
  }
}

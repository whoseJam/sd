import { SizedBoxSVGNode } from "@/node/box-node";

export abstract class BaseShape extends SizedBoxSVGNode {
  createSVGNode(label: string, attributes?: { [key: string]: any }) {
    return super.createSVGNode(label, attributes ?? {});
  }
}

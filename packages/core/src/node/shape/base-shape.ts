import { SDSVGNode } from "@/node/svg-node";

export abstract class BaseShape extends SDSVGNode {
  createSVGNode(label: string, attributes?: { [key: string]: any }) {
    return super.createSVGNode(label, attributes ?? {});
  }
}

import { SDSVGNode } from "@/Node/SDSVGNode";

export abstract class BaseShape extends SDSVGNode {
  createSVGNode(label: string, attributes?: { [key: string]: any }) {
    return super.createSVGNode(label, attributes ?? {});
  }
}

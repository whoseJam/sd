import type { SDNode } from "@/node/node";

import { pushLifecycle } from "@/animate/animate";
import { Window } from "@/animate/window";
import { EasingFunction as T } from "@/math/easing-function";
import { isStyleKey, setAttribute } from "@/renderer/attribute";
import { HTML, HTML_INNERHTML_SET } from "@/renderer/html";
import { SVG } from "@/renderer/svg";
import { Dom } from "@/utility/dom";

function parseText(text: string) {
  let ans = "";
  text = String(text);
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") ans += " ";
    else if (text[i] === "<") ans += "&lt;";
    else if (text[i] === ">") ans += "&gt;";
    else ans += text[i];
  }
  return ans;
}

interface RenderNodeParams {
  targetNode?: SDNode;
  targetLayer?: RenderNode;
  label?: string;
  element?: Element;
  append?: boolean;
  action?: boolean;
  l?: number;
  r?: number;
}

export class RenderNode {
  targetNode: SDNode;
  targetLayer: RenderNode;
  label: string;
  backingElement: Element;
  l?: number;
  r?: number;
  constructor(args: RenderNodeParams) {
    if (args.action === undefined) args.action = true;
    if (args.append === undefined) args.append = true;
    if (!args.element) {
      if (!args.label)
        throw new Error(
          "Unexpected: label is required when element is not provided",
        );
      if (HTML[args.label]) args.element = Dom.createElement(args.label);
      else args.element = Dom.createSVGElement(args.label);
    } else args.label = Dom.tagName(args.element);
    this.targetNode = args.targetNode;
    this.label = args.label;
    this.backingElement = args.element;
    this.l = args?.l ?? 0;
    this.r = args?.r ?? 0;
    if (!args.append) return;
    if (!args.targetLayer) return;
    if (!args.action) {
      this.targetLayer = args.targetLayer;
      args.targetLayer.__append(this);
    } else args.targetLayer.append(this); // set targetLayer in moveTo
  }

  delay() {
    if (!this.targetNode) return this.l;
    return this.targetNode.delay();
  }

  duration() {
    if (!this.targetNode) return this.r - this.l;
    return this.targetNode.duration();
  }

  element() {
    return this.backingElement;
  }

  elementAs<T>() {
    return this.element() as T;
  }

  getAttribute(key: string) {
    const element = this.element() as SVGElement | HTMLElement;
    if (HTML_INNERHTML_SET.has(key)) return element.innerHTML;
    else if (isStyleKey(this.getType(), key)) return element.style[key];
    return element.getAttribute(key);
  }

  setAttribute(key: string, value: any) {
    const element = this.element() as SVGElement | HTMLElement;
    if (HTML_INNERHTML_SET.has(key)) {
      if (key === "text") value = parseText(value);
      element.innerHTML = value;
    } else if (isStyleKey(this.getType(), key)) {
      element.style[key] = value;
    } else setAttribute(this.getType(), element, key, value);
  }

  renderAttribute(
    object: { setAttribute(key: string, value: any): void },
    key: string,
    value: any,
  ) {
    object.setAttribute(key, value);
  }

  hasShape() {
    return SVG[this.label]?.hasShape;
  }

  isSVG() {
    return SVG[this.label] !== undefined;
  }

  isHTML() {
    return !this.isSVG();
  }

  getType() {
    return this.isSVG() ? "svg" : "html";
  }

  append(element: string | RenderNode) {
    if (typeof element === "string") {
      return new RenderNode({
        targetNode: this.targetNode,
        targetLayer: this,
        label: element,
      });
    }
    if (Window.ACTION_TICK > 0) {
      this.__appendChild(element);
      return this;
    }
    const l = element.delay();
    const r = element.delay() + element.duration();
    const source = element.targetLayer;
    const target = this;
    function structure(t: number) {
      if (!this.reverse && t === 1) this.target.__appendChild(element);
      else if (this.reverse && t === 0) {
        if (this.target) this.target.__appendChild(element);
        else (element as RenderNode).__remove();
      }
    }
    element.targetLayer = target;
    pushLifecycle({
      entity: element,
      key: "layer(append)",
      l,
      r,
      from: source,
      to: target,
      callback: structure,
      timing: T.linear,
    });
    return this;
  }

  appendChild(element: RenderNode) {
    if (Window.ACTION_TICK > 0) {
      this.__appendChild(element);
      return this;
    }
    const l = element.delay();
    const r = element.delay() + element.duration();
    const source = element.targetLayer;
    const target = this;
    function structure(t: number) {
      if (!this.reverse && t === 1) this.target.__appendChild(element);
      else if (this.reverse && t === 0) {
        if (this.target) this.target.__appendChild(element);
        else element.__remove();
      }
    }
    element.targetLayer = target;
    pushLifecycle({
      entity: element,
      key: "layer(appendChild)",
      l,
      r,
      from: source,
      to: target,
      callback: structure,
      timing: T.linear,
    });
    return this;
  }

  insertBefore(element: RenderNode, referenced: RenderNode) {
    if (Window.ACTION_TICK > 0) {
      this.__insertBefore(element, referenced);
      return this;
    }
    const l = element.delay();
    const r = element.delay() + element.duration();
    const source = element.targetLayer;
    const target = this;
    function structure(t: number) {
      if (!this.reverse && t === 1)
        this.target.__insertBefore(element, referenced);
      else if (this.reverse && t === 0) {
        if (this.target) this.target.__appendChild(element);
        else element.__remove();
      }
    }
    element.targetLayer = target;
    pushLifecycle({
      entity: element,
      key: "layer(insertBefore)",
      l,
      r,
      from: source,
      to: target,
      callback: structure,
      timing: T.linear,
    });
    return this;
  }

  remove() {
    if (!this.targetLayer) return this;
    if (Window.ACTION_TICK > 0) {
      this.__remove();
      return this;
    }
    const l = this.delay();
    const r = this.delay() + this.duration();
    const source = this.targetLayer;
    const target = undefined;
    const element = this;
    function structure(t: number) {
      if (!this.reverse && t === 1) element.__remove();
      else if (this.reverse && t === 0) this.target.__appendChild(element);
    }
    pushLifecycle({
      entity: element,
      key: "layer(remove)",
      l,
      r,
      from: source,
      to: target,
      callback: structure,
      timing: T.linear,
    });
    return this;
  }

  __animate(l: number, r: number) {
    this.l = l;
    this.r = r;
    return this;
  }

  __append(element: Element | RenderNode) {
    const domElement =
      element instanceof RenderNode ? element.element() : element;
    this.element().append(domElement);
    return this;
  }

  __appendChild(element: Element | RenderNode) {
    const domElement =
      element instanceof RenderNode ? element.element() : element;
    this.element().appendChild(domElement);
    return this;
  }

  __insertBefore(
    element: Element | RenderNode,
    referenced: Element | RenderNode,
  ) {
    const domElement =
      element instanceof RenderNode ? element.element() : element;
    const referencedElement =
      referenced instanceof RenderNode ? referenced.element() : referenced;
    this.element().insertBefore(domElement, referencedElement);
    return this;
  }

  __remove() {
    this.element().remove();
    return this;
  }

  __removeChild(element: Element | RenderNode) {
    const domElement =
      element instanceof RenderNode ? element.element() : element;
    this.element().removeChild(domElement);
    return this;
  }

  __injectCSS(css: { [key: string]: string }) {
    Object.keys(css).forEach((key) => {
      (this.element() as HTMLElement).style[key] = css[key];
    });
  }

  static getDocumentBodyRenderNode() {
    return new RenderNode({
      targetNode: null,
      targetLayer: null,
      element: document.body,
      append: false,
      action: false,
    });
  }

  static createRenderNodeWithoutAction(
    targetNode: SDNode,
    targetLayer: RenderNode,
    label: string,
  ) {
    return new RenderNode({
      targetNode,
      targetLayer,
      label,
      action: false,
    });
  }

  static createMathRenderNode(
    targetNode: SDNode,
    targetLayer: RenderNode,
    element: Element,
  ) {
    const { MathManager } = require("@/node/text/text-engine/mathjax");
    const math = new RenderNode({
      targetNode,
      targetLayer,
      element,
      action: false,
    });
    MathManager.adjustMath(math);
    return math;
  }

  /**
   * The method will clone a math render node. The result math render node will not be appended to
   * the layer instantly. It will be appended by the blank node interpolation defined on 'math'.
   * @param math - The math render node to be cloned.
   */
  static cloneMathRenderNode(math: RenderNode) {
    const element = Dom.deepClone(math.element());
    const clone = new RenderNode({
      targetNode: math.targetNode,
      targetLayer: math.targetLayer,
      element,
      append: false,
      action: false,
    });
    return clone;
  }

  static createRenderNode(
    targetNode: SDNode,
    targetLayer: RenderNode,
    label: string,
  ) {
    return new RenderNode({
      targetNode,
      targetLayer,
      label,
    });
  }

  static createRenderNodeWithTime(
    targetLayer: RenderNode,
    l: number,
    r: number,
    label: string,
  ) {
    return new RenderNode({
      targetLayer,
      l,
      r,
      label,
    });
  }
}

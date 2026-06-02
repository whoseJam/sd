import type { SDNodeAttributes } from "@/node/node";
import type { Group } from "@/node/other/group";

import { Interp } from "@/animate/interp";
import { SizedBoxHTMLNode } from "@/node/box-node";
import { RenderNode } from "@/renderer/render-node";

export type CaptionAttributes = SDNodeAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
  textOpacity: number;
  primaryText: string;
  secondaryText: string;
};

class CaptionObject extends RenderNode {
  caption: Caption;
  container: RenderNode;
  cn: RenderNode;
  en: RenderNode;
  constructor(caption: Caption, container: RenderNode) {
    super({
      targetNode: caption,
      targetLayer: container,
      label: "div",
    });
    this.caption = caption;
    this.container = container;

    this.cn = RenderNode.createRenderNode(caption, container, "div");
    this.en = RenderNode.createRenderNode(caption, container, "div");

    this.container.__injectCSS({
      backgroundColor: "rgba(33, 37, 41, 0.7)",
      borderRadius: "12px",
      margin: "0px",
      padding: "0px",
      color: "white",
      textAlign: "center",
      opacity: "1",
      zIndex: "100",
      backdropFilter: "blur(5px)",
    });
    this.cn.__injectCSS({
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "1.5",
    });
    this.en.__injectCSS({
      fontSize: "18px",
      fontWeight: "400",
      fontFamily: "Times New Romans",
      opacity: "0.8",
      lineHeight: "1.5",
    });
    this.cn.setAttribute("text", "");
    this.en.setAttribute("text", "");
  }

  setAttribute(key: string, value: any) {
    if (key === "textOpacity") {
      this.cn.setAttribute("opacity", value);
      this.en.setAttribute("opacity", 0.8 * value);
    } else if (key === "primaryText") {
      this.cn.setAttribute("innerHTML", value);
    } else if (key === "secondaryText") {
      this.en.setAttribute("innerHTML", value);
    } else {
      super.setAttribute(key, value);
    }
  }

  getAttribute(key: string) {
    if (key === "textOpacity") {
      return this.cn.getAttribute("opacity");
    } else if (key === "primaryText") {
      return this.cn.getAttribute("innerHTML");
    } else if (key === "secondaryText") {
      return this.en.getAttribute("innerHTML");
    } else {
      return super.getAttribute(key);
    }
  }
}

export class Caption extends SizedBoxHTMLNode {
  declare attributes: CaptionAttributes;
  caption!: CaptionObject;

  constructor(args?: {
    targetNode?: Group;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    centerX?: number;
    centerY?: number;
    width?: number;
    height?: number;
  }) {
    super();

    const x = args?.x ?? 0;
    const y = args?.y ?? 0;
    const width = args?.width ?? 800;
    const height = args?.height ?? 80;
    this.attributes = {
      ...this.attributes,
      x,
      y,
      width,
      height,
      textOpacity: 1,
      primaryText: " ",
      secondaryText: " ",
    };

    const [foreign, container] = this.createHTMLNode("div", {
      x,
      y,
      width,
      height,
    });
    this.foreign = foreign;
    this.renderer = container;
    this.caption = new CaptionObject(this, container);

    if (args?.cx !== undefined) this.setCx(args.cx);
    if (args?.cy !== undefined) this.setCy(args.cy);
    if (args?.centerX !== undefined) this.setCenterX(args.centerX);
    if (args?.centerY !== undefined) this.setCenterY(args.centerY);

    args?.targetNode?.appendChild(this);
  }

  getX(): number {
    return this.attributes.x;
  }

  setX(x: number) {
    return this.triggerAttributeChanged(
      this.foreign,
      "x",
      x,
      this.attributes.x,
      Interp.numberInterp,
    );
  }

  onXChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("x", listener);
  }

  offXChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("x", listener);
  }

  getY(): number {
    return this.attributes.y;
  }

  setY(y: number) {
    return this.triggerAttributeChanged(
      this.foreign,
      "y",
      y,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  onYChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("y", listener);
  }

  offYChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("y", listener);
  }

  getWidth(): number {
    return this.attributes.width;
  }

  setWidth(width: number) {
    return this.triggerAttributeChanged(
      this.foreign,
      "width",
      width,
      this.attributes.width,
      Interp.numberInterp,
    );
  }

  onWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("width", listener);
  }

  offWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("width", listener);
  }

  getHeight(): number {
    return this.attributes.height;
  }

  setHeight(height: number) {
    return this.triggerAttributeChanged(
      this.foreign,
      "height",
      height,
      this.attributes.height,
      Interp.numberInterp,
    );
  }

  onHeightChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("height", listener);
  }

  offHeightChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("height", listener);
  }

  getTextOpacity() {
    return this.attributes.textOpacity;
  }

  setTextOpacity(opacity: number): this {
    return this.triggerAttributeChanged(
      this.caption,
      "textOpacity",
      opacity,
      this.attributes.textOpacity,
      Interp.numberInterp,
    );
  }

  getPrimaryText(): string {
    return this.attributes.primaryText;
  }

  setPrimaryText(text: string) {
    return this.triggerAttributeChanged(
      this.caption,
      "primaryText",
      text,
      this.attributes.primaryText,
      Interp.stringInterp,
    );
  }

  getSecondaryText(): string {
    return this.attributes.secondaryText;
  }

  setSecondaryText(text: string) {
    return this.triggerAttributeChanged(
      this.caption,
      "secondaryText",
      text,
      this.attributes.secondaryText,
      Interp.stringInterp,
    );
  }

  setCaption(cn: string, en: string) {
    return this.startSubAnimate()
      .subAnimate(0, 0.5)
      .setTextOpacity(0)
      .subAnimate(0.5, 0.5)
      .setPrimaryText(cn)
      .setSecondaryText(en)
      .subAnimate(0.5, 1)
      .setTextOpacity(1);
  }
}

import { Interp } from "@/Animate/Interp";
import { SDHTMLNode } from "@/Node/SDHTMLNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Group } from "@/Node/Other/Group";

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

export class Caption extends SDHTMLNode {
    _: SDHTMLNode["_"] & {
        textOpacity: number;
        primaryText: string;
        secondaryText: string;
        caption: CaptionObject;
    };
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

        Object.assign(this._, {
            textOpacity: 1,
            primaryText: " ",
            secondaryText: " ",
        });

        const [foreign, container] = this.createHTMLNode("div", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 800,
            height: args?.height ?? 80,
        });
        const caption = new CaptionObject(this, container);
        this._.foreign = foreign;
        this._.renderer = container;
        this._.caption = caption;

        if (args?.cx !== undefined) this.setCx(args.cx);
        if (args?.cy !== undefined) this.setCy(args.cy);
        if (args?.centerX !== undefined) this.setCenterX(args.centerX);
        if (args?.centerY !== undefined) this.setCenterY(args.centerY);

        args?.targetNode?.appendChild(this);
    }

    getX(): number {
        return this._.x;
    }

    setX(x: number) {
        return this.triggerAttributeChanged(this._.foreign, "x", x, this._.x, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number) {
        return this.triggerAttributeChanged(this._.foreign, "y", y, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number) {
        return this.triggerAttributeChanged(this._.foreign, "width", width, this._.width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number) {
        return this.triggerAttributeChanged(this._.foreign, "height", height, this._.height, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("height", listener);
    }

    setCx(cx: number) {
        return this.setX(this.getX() + cx - this.getCx());
    }

    setCenterX(cx: number) {
        return this.setCx(cx);
    }

    setCy(cy: number) {
        return this.setY(this.getY() + cy - this.getCy());
    }

    setCenterY(cy: number) {
        return this.setCy(cy);
    }

    getTextOpacity() {
        return this._.textOpacity;
    }

    setTextOpacity(opacity: number): this {
        return this.triggerAttributeChanged(
            this._.caption,
            "textOpacity",
            opacity,
            this._.textOpacity,
            Interp.numberInterp
        );
    }

    getPrimaryText(): string {
        return this._.primaryText;
    }

    setPrimaryText(text?: string) {
        return this.triggerAttributeChanged(
            this._.caption,
            "primaryText",
            text,
            this._.primaryText,
            Interp.stringInterp
        );
    }

    getSecondaryText(): string {
        return this._.secondaryText;
    }

    setSecondaryText(text?: string) {
        return this.triggerAttributeChanged(
            this._.caption,
            "secondaryText",
            text,
            this._.secondaryText,
            Interp.stringInterp
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

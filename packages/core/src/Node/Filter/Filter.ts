import { Percent, SDNode } from "@/Node/SDNode";
import { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDString, URLString } from "@/Utility/String";
import { BaseFilter } from "@/Node/Filter/BaseFilter";
import { Interp } from "@/Animate/Interp";

export type SDFilter = Filter | string | URLString;

export class Filter extends BaseFilter {
    _: BaseFilter["_"] & {
        id: string;
    };

    constructor(args?: {
        targetNode?: Group;
        id?: string;
        x?: Percent;
        y?: Percent;
        width?: Percent;
        height?: Percent;
    }) {
        super();

        this._.renderer = this.createSVGNode("filter", {
            id: args?.id ?? "",
            x: args?.x ?? "-10%",
            y: args?.y ?? "-10%",
            width: args?.width ?? "120%",
            height: args?.height ?? "120%",
        });

        args?.targetNode?.append(this);
    }

    append(child: SDNode | RenderNode) {
        if (child instanceof SDNode) {
            this.getRootRenderNode().append(child.getRootRenderNode());
            child._.parent = this;
        } else this.getRootRenderNode().append(child);
        return this;
    }

    appendChild(child: SDNode | RenderNode) {
        child._.parent = this;
        if (child instanceof SDNode) {
            this.getRootRenderNode().appendChild(child.getRootRenderNode());
            child._.parent = this;
        } else this.getRootRenderNode().appendChild(child);
        return this;
    }

    insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
        if (child instanceof SDNode) child._.parent = this;
        const child_ = child instanceof SDNode ? child.getRootRenderNode() : child;
        const referenced_ = referenced instanceof SDNode ? referenced.getRootRenderNode() : referenced;
        this.getRootRenderNode().insertBefore(child_, referenced_);
        return this;
    }

    getId() {
        return this._.id;
    }

    setId(id: string) {
        return this.triggerAttributeChanged(this._.renderer, "id", id, this._.id, Interp.stringInterp);
    }

    setX(x: Percent) {
        return this.triggerAttributeChanged(this._.renderer, "x", x, this._.x);
    }

    setY(y: Percent) {
        return this.triggerAttributeChanged(this._.renderer, "y", y, this._.y);
    }

    setWidth(width: Percent) {
        return this.triggerAttributeChanged(this._.renderer, "width", width, this._.width);
    }

    setHeight(height: Percent) {
        return this.triggerAttributeChanged(this._.renderer, "height", height, this._.height);
    }

    static toURLString(filter: SDFilter) {
        if (filter === undefined) return "";
        if (filter instanceof Filter) return `url(#${filter.getId()})`;
        return SDString.toURLString(filter);
    }
}

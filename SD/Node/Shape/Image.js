import { getTargetLayer } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { Check } from "@/Utility/Check";

export class Image {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { ImageHTML } = require("@/Node/Shape/ImageHTML");
            return new ImageHTML(target);
        } else {
            const { ImageSVG } = require("@/Node/Shape/ImageSVG");
            return new ImageSVG(target);
        }
    }
}

Object.assign(Image.prototype, {
    toPolygon: Rect.prototype.toPolygon,
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    },
    href(href) {
        if (arguments.length === 0) return this.vars.href;
        Check.validateNumberOrString(href, `${this.constructor.name}.href`);
        this.vars.href = href;
        return this;
    },
});

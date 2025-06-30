import { getTargetLayer } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Rect } from "@/Node/Shape/Rect";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Image extends BaseShape {
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
});

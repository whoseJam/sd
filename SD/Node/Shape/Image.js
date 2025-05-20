import { ImageHTML } from "@/Node/HTML/Shape/ImageHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { ImageSVG } from "@/Node/SVG/Shape/ImageSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Image(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new ImageHTML(target);
    } else {
        return new ImageSVG(target);
    }
}

Image.prototype = {
    toPolygon: Rect.prototype.toPolygon,
};

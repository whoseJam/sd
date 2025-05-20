import { ButtonHTML } from "@/Node/HTML/Control/ButtonHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { ButtonSVG } from "@/Node/SVG/Control/ButtonSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Button(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new ButtonHTML(target);
    } else {
        return new ButtonSVG(target);
    }
}

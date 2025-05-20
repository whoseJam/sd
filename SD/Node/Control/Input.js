import { InputHTML } from "@/Node/HTML/Control/InputHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { InputSVG } from "@/Node/SVG/Control/InputSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Input(target) {
    const targetLayer = getTargetLayer(layer);
    if (targetLayer instanceof HTMLNode) {
        return new InputHTML(target);
    } else {
        return new InputSVG(target);
    }
}

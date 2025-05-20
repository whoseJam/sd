import { SliderHTML } from "@/Node/HTML/Control/SliderHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { SliderSVG } from "@/Node/SVG/Control/SliderSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Slider(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new SliderHTML(target);
    } else {
        return new SliderSVG(target);
    }
}

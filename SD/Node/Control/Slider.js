import { BaseControl } from "@/Node/Control/BaseControl";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Slider extends BaseControl {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { SliderHTML } = require("@/Node/Control/SliderHTML");
            return new SliderHTML(target);
        } else {
            const { SliderSVG } = require("@/Node/Control/SliderSVG");
            return new SliderSVG(target);
        }
    }
}

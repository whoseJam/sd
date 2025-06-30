import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Button {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { ButtonHTML } = require("@/Node/Control/ButtonHTML");
            return new ButtonHTML(target);
        } else {
            const { ButtonSVG } = require("@/Node/Control/ButtonSVG");
            return new ButtonSVG(target);
        }
    }
}

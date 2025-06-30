import { BaseControl } from "@/Node/Control/BaseControl";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Input extends BaseControl {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { InputHTML } = require("@/Node/Control/InputHTML");
            return new InputHTML(target);
        } else {
            const { InputSVG } = require("@/Node/Control/InputSVG");
            return new InputSVG(target);
        }
    }
}

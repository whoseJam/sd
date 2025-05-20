import { BaseSVG } from "@/Node/SVG/BaseSVG";

export function BaseShapeSVG(target, label) {
    BaseSVG.call(this, target, label);
}

BaseShapeSVG.prototype = {
    ...BaseSVG.prototype,
};

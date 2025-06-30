import { BaseShape } from "../Shape/BaseShape";

export class Text extends BaseShape {
    constructor(target, text = "") {
        const { TextSVG } = require("@/Node/Text/TextSVG");
        return new TextSVG(target, text);
    }
}

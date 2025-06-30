import { BasePath } from "@/Node/Path/BasePath";

export class Line extends BasePath {
    constructor(target, value) {
        const { LineSVG } = require("@/Node/Path/LineSVG");
        return new LineSVG(target, value);
    }
}

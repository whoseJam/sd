import { BasePath } from "@/Node/Path/BasePath";

export class Path extends BasePath {
    constructor(target) {
        const { PathSVG } = require("@/Node/Path/PathSVG");
        return new PathSVG(target);
    }
}

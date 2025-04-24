import { FixGapAxis } from "@/Node/Axis/FixGapAxis";
import { BaseCoord } from "@/Node/Coord/BaseCoord";
import { Coord } from "@/Node/Coord/Coord";

export function FixGapCoord(parent) {
    BaseCoord.call(this, parent);

    this.type("FixGapCoord");

    this.childAs("y", new FixGapAxis(this).direction(0, -1).withTickLabel(true).tickLabelAlign("target"), (parent, child) => {
        child.source(parent.pos("x", "my"));
    });
    this.childAs("x", new FixGapAxis(this).direction(1, 0).withTickLabel(true), (parent, child) => {
        child.source(parent.pos("x", "my"));
    });
}

FixGapCoord.prototype = {
    ...Coord.prototype,
    gap(by, gap) {
        if (arguments.length === 1) return this.axis(by).gap();
        this.axis(by).gap(gap);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.axis("x").length();
        this.axis("x").length(width);
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.axis("y").length();
        this.axis("y").length(height);
        return this;
    },
};

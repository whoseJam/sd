import { ColorInterpolationFilters, OneInputFilter } from "@/Node/Filter/OneInputFilter";
import { Percent } from "@/Node/SDNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

export class Offset extends OneInputFilter {
    _: OneInputFilter["_"] & {
        dx: number;
        dy: number;
    };

    constructor(args?: {
        targetNode?: Filter;
        in?: string;
        result?: string;
        colorInterpolationFilters?: ColorInterpolationFilters;
        dx?: number;
        dy?: number;
    }) {
        super();

        this.renderer = this.createSVGNode("feOffset", {
            in: args?.in ?? "SourceGraphic",
            result: args?.result ?? "",
            colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
            dx: args?.dx ?? 0,
            dy: args?.dy ?? 0,
        });
    }

    getDx() {
        return this._.dx;
    }

    setDx(dx: number) {
        return this.triggerAttributeChanged(this.renderer, "dx", dx, this._.dx, Interp.numberInterp);
    }

    onDxChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("dx", listener);
    }

    offDxChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("dx", listener);
    }

    getDy() {
        return this._.dy;
    }

    setDy(dy: number) {
        return this.triggerAttributeChanged(this.renderer, "dy", dy, this._.dy, Interp.numberInterp);
    }

    onDyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("dy", listener);
    }

    offDyChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("dy", listener);
    }
}

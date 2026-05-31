import { ColorInterpolationFilters, OneInputFilter } from "@/Node/Filter/OneInputFilter";
import { Percent } from "@/Node/SDNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

type ColorMatrixType = "saturate" | "hueRotate" | "luminanceToAlpha" | "matrix";

export class ColorMatrix extends OneInputFilter {
    /* model fields:

        type: ColorMatrixType;
        values: number | Array<number>;
        */

    constructor(args?: {
        targetNode?: Filter;
        in?: string;
        result?: string;
        colorInterpolationFilters?: ColorInterpolationFilters;
        type?: ColorMatrixType;
        values?: number | Array<number>;
    }) {
        super();

        this.renderer = this.createSVGNode("feColorMatrix", {
            in: args?.in ?? "SourceGraphic",
            result: args?.result ?? "",
            colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
            type: args?.type ?? "matrix",
            values: args?.values ?? [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        });

        args?.targetNode?.append(this);
    }

    getType() {
        return this.type;
    }

    setType(type: string) {
        return this.triggerAttributeChanged(this.renderer, "type", type, this.type);
    }

    onTypeChanged(listener: (vn: ColorMatrixType, vo: ColorMatrixType) => void) {
        return this.onAttributeChanged("type", listener);
    }

    offTypeChanged(listener: (vn: ColorMatrixType, vo: ColorMatrixType) => void) {
        return this.offAttributeChanged("type", listener);
    }

    getValues() {
        return this.values;
    }

    setValues(values: number | Array<number>) {
        return this.triggerAttributeChanged(this.renderer, "values", values, this.values, Interp.arrayInterp);
    }

    onValuesChanged(listener: (vn: number | Array<number>, vo: number | Array<number>) => void) {
        return this.onAttributeChanged("values", listener);
    }

    offValuesChanged(listener: (vn: number | Array<number>, vo: number | Array<number>) => void) {
        return this.offAttributeChanged("values", listener);
    }
}

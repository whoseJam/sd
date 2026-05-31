import { Interp } from "@/Animate/Interp";
import { BaseFilter } from "@/Node/Filter/BaseFilter";

export type ColorInterpolationFilters = "sRGB" | "linearRGB";

export class TwoInputFilter extends BaseFilter {
    /* model fields:

        in: string;
        in2: string;
        result: string;
        colorInterpolationFilters: ColorInterpolationFilters;
        */

    getIn() {
        return this.in;
    }

    setIn(input: string) {
        return this.triggerAttributeChanged(this.renderer, "in", input, this.in, Interp.stringInterp);
    }

    onInChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("in", listener);
    }

    offInChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("in", listener);
    }

    getIn2() {
        return this.in2;
    }

    setIn2(input: string) {
        return this.triggerAttributeChanged(this.renderer, "in2", input, this.in2, Interp.stringInterp);
    }

    onIn2Changed(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("in2", listener);
    }

    offIn2Changed(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("in2", listener);
    }

    getResult() {
        return this.result;
    }

    setResult(result: string) {
        return this.triggerAttributeChanged(this.renderer, "result", result, this.result, Interp.stringInterp);
    }

    onResultChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("result", listener);
    }

    offResultChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("result", listener);
    }

    getColorInterpolationFilters() {
        return this.colorInterpolationFilters;
    }

    setColorInterpolationFilters(color: ColorInterpolationFilters) {
        return this.triggerAttributeChanged(
            this.renderer,
            "colorInterpolationFilters",
            color,
            this.colorInterpolationFilters,
            Interp.stringInterp
        );
    }

    onColorInterpolationFiltersChanged(
        listener: (vn: ColorInterpolationFilters, vo: ColorInterpolationFilters) => void
    ) {
        return this.onAttributeChanged("colorInterpolationFilters", listener);
    }

    offColorInterpolationFiltersChanged(
        listener: (vn: ColorInterpolationFilters, vo: ColorInterpolationFilters) => void
    ) {
        return this.offAttributeChanged("colorInterpolationFilters", listener);
    }
}

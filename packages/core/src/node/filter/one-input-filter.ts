import type { SDSVGNodeAttributes } from "@/node/svg-node";

import { Interp } from "@/animate/interp";
import { BaseFilter } from "@/node/filter/base-filter";

export type ColorInterpolationFilters = "sRGB" | "linearRGB";

export type OneInputFilterAttributes = SDSVGNodeAttributes & {
  in: string;
  result: string;
  colorInterpolationFilters: ColorInterpolationFilters;
};

export class OneInputFilter extends BaseFilter {
  declare attributes: OneInputFilterAttributes;

  get in(): string {
    return this.attributes.in;
  }

  set in(v: string) {
    this.triggerAttributeChanged(
      this.renderer,
      "in",
      v,
      this.attributes.in,
      Interp.stringInterp,
    );
  }

  getIn() {
    return this.in;
  }

  setIn(input: string): this {
    this.in = input;
    return this;
  }

  onInChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("in", listener);
  }

  offInChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("in", listener);
  }

  get result(): string {
    return this.attributes.result;
  }

  set result(v: string) {
    this.triggerAttributeChanged(
      this.renderer,
      "result",
      v,
      this.attributes.result,
      Interp.stringInterp,
    );
  }

  getResult() {
    return this.result;
  }

  setResult(result: string): this {
    this.result = result;
    return this;
  }

  onResultChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("result", listener);
  }

  offResultChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("result", listener);
  }

  get colorInterpolationFilters(): ColorInterpolationFilters {
    return this.attributes.colorInterpolationFilters;
  }

  set colorInterpolationFilters(v: ColorInterpolationFilters) {
    this.triggerAttributeChanged(
      this.renderer,
      "colorInterpolationFilters",
      v,
      this.attributes.colorInterpolationFilters,
      Interp.stringInterp,
    );
  }

  getColorInterpolationFilters() {
    return this.colorInterpolationFilters;
  }

  setColorInterpolationFilters(color: ColorInterpolationFilters): this {
    this.colorInterpolationFilters = color;
    return this;
  }

  onColorInterpolationFiltersChanged(
    listener: (
      vn: ColorInterpolationFilters,
      vo: ColorInterpolationFilters,
    ) => void,
  ) {
    return this.onAttributeChanged("colorInterpolationFilters", listener);
  }

  offColorInterpolationFiltersChanged(
    listener: (
      vn: ColorInterpolationFilters,
      vo: ColorInterpolationFilters,
    ) => void,
  ) {
    return this.offAttributeChanged("colorInterpolationFilters", listener);
  }
}

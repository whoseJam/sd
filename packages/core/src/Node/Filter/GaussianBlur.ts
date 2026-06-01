import type { Filter } from "@/Node/Filter/Filter";
import type {
  ColorInterpolationFilters,
  OneInputFilterAttributes,
} from "@/Node/Filter/OneInputFilter";

import { Interp } from "@/Animate/Interp";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";

export type GaussianBlurAttributes = OneInputFilterAttributes & {
  stdDeviation: [number, number];
};

export class GaussianBlur extends OneInputFilter {
  declare attributes: GaussianBlurAttributes;

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    result?: string;
    colorInterpolationFilters?: ColorInterpolationFilters;
    stdDeviation?: number | [number, number];
  }) {
    super();

    const stdDeviation: [number, number] =
      typeof args?.stdDeviation === "number"
        ? [args.stdDeviation, args.stdDeviation]
        : (args?.stdDeviation ?? [0, 0]);

    this.attributes = {
      ...this.attributes,
      in: args?.in ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
      stdDeviation,
    };

    this.renderer = this.createSVGNode("feGaussianBlur", {
      in: this.attributes.in,
      result: this.attributes.result,
      colorInterpolationFilters: this.attributes.colorInterpolationFilters,
      stdDeviation: this.attributes.stdDeviation,
    });

    args?.targetNode?.append(this);
  }

  get stdDeviation(): [number, number] {
    return this.attributes.stdDeviation;
  }

  set stdDeviation(v: [number, number]) {
    this.triggerAttributeChanged(
      this.renderer,
      "stdDeviation",
      v,
      this.attributes.stdDeviation,
      Interp.vectorInterp,
    );
  }

  getStdDeviation() {
    return this.stdDeviation;
  }

  setStdDeviation(std: number | [number, number]): this {
    this.stdDeviation = typeof std === "number" ? [std, std] : std;
    return this;
  }

  onStdDeviationChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ) {
    return this.onAttributeChanged("stdDeviation", listener);
  }

  offStdDeviationChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ) {
    return this.offAttributeChanged("stdDeviation", listener);
  }
}

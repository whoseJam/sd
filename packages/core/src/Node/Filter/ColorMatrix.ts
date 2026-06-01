import type { Filter } from "@/Node/Filter/Filter";
import type {
  ColorInterpolationFilters,
  OneInputFilterAttributes,
} from "@/Node/Filter/OneInputFilter";

import { Interp } from "@/Animate/Interp";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";

export type ColorMatrixType =
  | "saturate"
  | "hueRotate"
  | "luminanceToAlpha"
  | "matrix";

export type ColorMatrixAttributes = OneInputFilterAttributes & {
  type: ColorMatrixType;
  values: number | Array<number>;
};

export class ColorMatrix extends OneInputFilter {
  declare attributes: ColorMatrixAttributes;

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    result?: string;
    colorInterpolationFilters?: ColorInterpolationFilters;
    type?: ColorMatrixType;
    values?: number | Array<number>;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      in: args?.in ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
      type: args?.type ?? "matrix",
      values: args?.values ?? [
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
      ],
    };

    this.renderer = this.createSVGNode("feColorMatrix", {
      in: this.attributes.in,
      result: this.attributes.result,
      colorInterpolationFilters: this.attributes.colorInterpolationFilters,
      type: this.attributes.type,
      values: this.attributes.values,
    });

    args?.targetNode?.append(this);
  }

  get type(): ColorMatrixType {
    return this.attributes.type;
  }

  set type(v: ColorMatrixType) {
    this.triggerAttributeChanged(
      this.renderer,
      "type",
      v,
      this.attributes.type,
    );
  }

  getType() {
    return this.type;
  }

  setType(type: ColorMatrixType): this {
    this.type = type;
    return this;
  }

  onTypeChanged(listener: (vn: ColorMatrixType, vo: ColorMatrixType) => void) {
    return this.onAttributeChanged("type", listener);
  }

  offTypeChanged(listener: (vn: ColorMatrixType, vo: ColorMatrixType) => void) {
    return this.offAttributeChanged("type", listener);
  }

  get values(): number | Array<number> {
    return this.attributes.values;
  }

  set values(v: number | Array<number>) {
    this.triggerAttributeChanged(
      this.renderer,
      "values",
      v,
      this.attributes.values,
      Interp.arrayInterp,
    );
  }

  getValues() {
    return this.values;
  }

  setValues(values: number | Array<number>): this {
    this.values = values;
    return this;
  }

  onValuesChanged(
    listener: (vn: number | Array<number>, vo: number | Array<number>) => void,
  ) {
    return this.onAttributeChanged("values", listener);
  }

  offValuesChanged(
    listener: (vn: number | Array<number>, vo: number | Array<number>) => void,
  ) {
    return this.offAttributeChanged("values", listener);
  }
}

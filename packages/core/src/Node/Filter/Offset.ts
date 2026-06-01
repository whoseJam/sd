import type { Filter } from "@/Node/Filter/Filter";
import type {
  ColorInterpolationFilters,
  OneInputFilterAttributes,
} from "@/Node/Filter/OneInputFilter";

import { Interp } from "@/Animate/Interp";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";

export type OffsetAttributes = OneInputFilterAttributes & {
  dx: number;
  dy: number;
};

export class Offset extends OneInputFilter {
  declare attributes: OffsetAttributes;

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    result?: string;
    colorInterpolationFilters?: ColorInterpolationFilters;
    dx?: number;
    dy?: number;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      in: args?.in ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
      dx: args?.dx ?? 0,
      dy: args?.dy ?? 0,
    };

    this.renderer = this.createSVGNode("feOffset");
  }

  get dx(): number {
    return this.attributes.dx;
  }

  set dx(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "dx",
      v,
      this.attributes.dx,
      Interp.numberInterp,
    );
  }

  getDx() {
    return this.dx;
  }

  setDx(dx: number): this {
    this.dx = dx;
    return this;
  }

  onDxChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("dx", listener);
  }

  offDxChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("dx", listener);
  }

  get dy(): number {
    return this.attributes.dy;
  }

  set dy(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "dy",
      v,
      this.attributes.dy,
      Interp.numberInterp,
    );
  }

  getDy() {
    return this.dy;
  }

  setDy(dy: number): this {
    this.dy = dy;
    return this;
  }

  onDyChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("dy", listener);
  }

  offDyChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("dy", listener);
  }
}

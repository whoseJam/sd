import type { Filter } from "@/Node/Filter/Filter";
import type { ColorInterpolationFilters } from "@/Node/Filter/OneInputFilter";

import { Interp } from "@/Animate/Interp";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";
import { Percent } from "@/Node/SDNode";

export class Offset extends OneInputFilter {
  /* model fields:

        dx: number;
        dy: number;
        */

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
    return this.dx;
  }

  setDx(dx: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "dx",
      dx,
      this.dx,
      Interp.numberInterp,
    );
  }

  onDxChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("dx", listener);
  }

  offDxChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("dx", listener);
  }

  getDy() {
    return this.dy;
  }

  setDy(dy: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "dy",
      dy,
      this.dy,
      Interp.numberInterp,
    );
  }

  onDyChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("dy", listener);
  }

  offDyChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("dy", listener);
  }
}

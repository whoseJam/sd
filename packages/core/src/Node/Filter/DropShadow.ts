import type { Filter } from "@/Node/Filter/Filter";
import type { ColorInterpolationFilters } from "@/Node/Filter/OneInputFilter";
import type { SDColor } from "@/Utility/Color";

import { Interp } from "@/Animate/Interp";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";
import { Percent } from "@/Node/SDNode";
import { SDAllColor, Color as C } from "@/Utility/Color";

export class DropShadow extends OneInputFilter {
  /* model fields:

        stdDeviation: number | [number, number];
        dx: number;
        dy: number;
        floodColor: SDAllColor;
        floodOpacity: number;
        */

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    result?: string;
    colorInterpolationFilters?: ColorInterpolationFilters;
    stdDeviation?: number | [number, number];
    dx?: number;
    dy?: number;
    floodColor?: SDColor;
    floodOpacity?: number;
  }) {
    super();

    if (typeof args?.stdDeviation === "number")
      args.stdDeviation = [args.stdDeviation, args.stdDeviation];
    this.renderer = this.createSVGNode("feDropShadow", {
      in: args?.in ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
      stdDeviation: args?.stdDeviation ?? [0, 0],
      dx: args?.dx ?? 0,
      dy: args?.dy ?? 0,
      floodColor: args?.floodColor ?? C.black,
      floodOpacity: args?.floodOpacity ?? 1,
    });

    args?.targetNode?.append(this);
  }

  getStdDeviation() {
    return this.stdDeviation;
  }

  setStdDeviation(std: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "stdDeviation",
      std,
      this.stdDeviation,
      Interp.vectorInterp,
    );
  }

  onStdDeviationChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("stdDeviation", listener);
  }

  offStdDeviationChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("stdDeviation", listener);
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

  getFloodColor() {
    return this.floodColor;
  }

  setFloodColor(color: SDColor) {
    return this.triggerAttributeChanged(
      this.renderer,
      "floodColor",
      color,
      this.floodColor,
      Interp.colorInterp,
    );
  }

  onFloodColorChanged(listener: (vn: SDColor, vo: SDColor) => void) {
    return this.onAttributeChanged("floodColor", listener);
  }

  offFloodColorChanged(listener: (vn: SDColor, vo: SDColor) => void) {
    return this.offAttributeChanged("floodColor", listener);
  }

  getFloodOpacity() {
    return this.floodOpacity;
  }

  setFloodOpacity(opacity: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "floodOpacity",
      opacity,
      this.floodOpacity,
      Interp.numberInterp,
    );
  }

  onFloodOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("floodOpacity", listener);
  }

  offFloodOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("floodOpacity", listener);
  }
}

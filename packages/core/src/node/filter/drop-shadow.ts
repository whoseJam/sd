import type { Filter } from "@/node/filter/filter";
import type {
  ColorInterpolationFilters,
  OneInputFilterAttributes,
} from "@/node/filter/one-input-filter";
import type { SDColor, SDRGBAColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { OneInputFilter } from "@/node/filter/one-input-filter";
import { Color as C } from "@/utility/color";

export type DropShadowAttributes = OneInputFilterAttributes & {
  stdDeviation: [number, number];
  dx: number;
  dy: number;
  floodColor: SDRGBAColor;
  floodOpacity: number;
};

export class DropShadow extends OneInputFilter {
  declare attributes: DropShadowAttributes;

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
      dx: args?.dx ?? 0,
      dy: args?.dy ?? 0,
      floodColor: C.toRGBA(args?.floodColor ?? C.black),
      floodOpacity: args?.floodOpacity ?? 1,
    };

    this.renderer = this.createSVGNode("feDropShadow");

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

  get floodColor(): SDRGBAColor {
    return this.attributes.floodColor;
  }

  set floodColor(v: SDRGBAColor) {
    this.triggerAttributeChanged(
      this.renderer,
      "floodColor",
      v,
      this.attributes.floodColor,
      Interp.colorInterp,
    );
  }

  getFloodColor() {
    return this.floodColor;
  }

  setFloodColor(color: SDColor): this {
    this.floodColor = C.toRGBA(color);
    return this;
  }

  onFloodColorChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.onAttributeChanged("floodColor", listener);
  }

  offFloodColorChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.offAttributeChanged("floodColor", listener);
  }

  get floodOpacity(): number {
    return this.attributes.floodOpacity;
  }

  set floodOpacity(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "floodOpacity",
      v,
      this.attributes.floodOpacity,
      Interp.numberInterp,
    );
  }

  getFloodOpacity() {
    return this.floodOpacity;
  }

  setFloodOpacity(opacity: number): this {
    this.floodOpacity = opacity;
    return this;
  }

  onFloodOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("floodOpacity", listener);
  }

  offFloodOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("floodOpacity", listener);
  }
}

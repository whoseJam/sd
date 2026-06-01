import type { Filter } from "@/Node/Filter/Filter";
import type { TwoInputFilterAttributes } from "@/Node/Filter/TwoInputFilter";

import { Interp } from "@/Animate/Interp";
import { TwoInputFilter } from "@/Node/Filter/TwoInputFilter";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion";

export type BlendAttributes = TwoInputFilterAttributes & {
  mode: BlendMode;
};

export class Blend extends TwoInputFilter {
  declare attributes: BlendAttributes;

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    in2?: string;
    result?: string;
    mode?: BlendMode;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      in: args?.in ?? "SourceGraphic",
      in2: args?.in2 ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: "sRGB",
      mode: args?.mode ?? "normal",
    };

    this.renderer = this.createSVGNode("feBlend", {
      in: this.attributes.in,
      in2: this.attributes.in2,
      mode: this.attributes.mode,
    });

    args?.targetNode?.append(this);
  }

  get mode(): BlendMode {
    return this.attributes.mode;
  }

  set mode(v: BlendMode) {
    this.triggerAttributeChanged(
      this.renderer,
      "mode",
      v,
      this.attributes.mode,
      Interp.stringInterp,
    );
  }

  getMode() {
    return this.mode;
  }

  setMode(mode: BlendMode): this {
    this.mode = mode;
    return this;
  }

  onModeChanged(listener: (vn: BlendMode, vo: BlendMode) => void) {
    return this.onAttributeChanged("mode", listener);
  }

  offModeChanged(listener: (vn: BlendMode, vo: BlendMode) => void) {
    return this.offAttributeChanged("mode", listener);
  }
}

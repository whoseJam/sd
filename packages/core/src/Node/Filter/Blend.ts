import type { Filter } from "@/Node/Filter/Filter";

import { Interp } from "@/Animate/Interp";
import { TwoInputFilter } from "@/Node/Filter/TwoInputFilter";
import { Percent } from "@/Node/SDNode";

type Mode =
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

export class Blend extends TwoInputFilter {
  /* model fields:

        mode: Mode;
        */

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    in2?: string;
    result?: string;
    mode?: Mode;
  }) {
    super();

    this.renderer = this.createSVGNode("feBlend", {
      in: args?.in ?? "SourceGraphic",
      in2: args?.in2 ?? "SourceGraphic",
      mode: args?.mode ?? "normal",
    });

    args?.targetNode?.append(this);
  }

  getMode() {
    return this.mode;
  }

  setMode(mode: string) {
    return this.triggerAttributeChanged(
      this.renderer,
      "mode",
      mode,
      this.mode,
      Interp.stringInterp,
    );
  }

  onModeChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("mode", listener);
  }

  offModeChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("mode", listener);
  }
}

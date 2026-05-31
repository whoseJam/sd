import { TwoInputFilter } from "@/Node/Filter/TwoInputFilter";
import type { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";
import { Percent } from "@/Node/SDNode";

type Operator =
  | "over"
  | "in"
  | "out"
  | "atop"
  | "xor"
  | "arithmetic"
  | "lighter";

export class Composite extends TwoInputFilter {
  /* model fields:

        operator: Operator;
        k1: number;
        k2: number;
        k3: number;
        k4: number;
        */

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    in2?: string;
    result?: string;
    operator?: string;
    k1?: number;
    k2?: number;
    k3?: number;
    k4?: number;
  }) {
    super();

    this.renderer = this.createSVGNode("feComposite", {
      in: args?.in ?? "SourceGraphic",
      in2: args?.in2 ?? "SourceGraphic",
      operator: args?.operator ?? "over",
      k1: args?.k1 ?? 0,
      k2: args?.k2 ?? 0,
      k3: args?.k3 ?? 0,
      k4: args?.k4 ?? 0,
    });

    args?.targetNode?.append(this);
  }

  getOperator() {
    return this.operator;
  }

  setOperator(operator: string) {
    return this.triggerAttributeChanged(
      this.renderer,
      "operator",
      operator,
      this.operator,
      Interp.stringInterp,
    );
  }

  onOperatorChanged(listener: (vn: string, vo: string) => void) {
    return this.onAttributeChanged("operator", listener);
  }

  offOperatorChanged(listener: (vn: string, vo: string) => void) {
    return this.offAttributeChanged("operator", listener);
  }

  getK1() {
    return this.k1;
  }

  setK1(k1: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "k1",
      k1,
      this.k1,
      Interp.numberInterp,
    );
  }

  onK1Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k1", listener);
  }

  offK1Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k1", listener);
  }

  getK2() {
    return this.k2;
  }

  setK2(k2: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "k2",
      k2,
      this.k2,
      Interp.numberInterp,
    );
  }

  onK2Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k2", listener);
  }

  offK2Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k2", listener);
  }

  getK3() {
    return this.k3;
  }

  setK3(k3: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "k3",
      k3,
      this.k3,
      Interp.numberInterp,
    );
  }

  onK3Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k3", listener);
  }

  offK3Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k3", listener);
  }

  getK4() {
    return this.k4;
  }

  setK4(k4: number) {
    return this.triggerAttributeChanged(
      this.renderer,
      "k4",
      k4,
      this.k4,
      Interp.numberInterp,
    );
  }

  onK4Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k4", listener);
  }

  offK4Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k4", listener);
  }
}

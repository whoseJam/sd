import type { Filter } from "@/Node/Filter/Filter";
import type { TwoInputFilterAttributes } from "@/Node/Filter/TwoInputFilter";

import { Interp } from "@/Animate/Interp";
import { TwoInputFilter } from "@/Node/Filter/TwoInputFilter";

export type CompositeOperator =
  | "over"
  | "in"
  | "out"
  | "atop"
  | "xor"
  | "arithmetic"
  | "lighter";

export type CompositeAttributes = TwoInputFilterAttributes & {
  operator: CompositeOperator;
  k1: number;
  k2: number;
  k3: number;
  k4: number;
};

export class Composite extends TwoInputFilter {
  declare attributes: CompositeAttributes;

  constructor(args?: {
    targetNode?: Filter;
    in?: string;
    in2?: string;
    result?: string;
    operator?: CompositeOperator;
    k1?: number;
    k2?: number;
    k3?: number;
    k4?: number;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      in: args?.in ?? "SourceGraphic",
      in2: args?.in2 ?? "SourceGraphic",
      result: args?.result ?? "",
      colorInterpolationFilters: "sRGB",
      operator: args?.operator ?? "over",
      k1: args?.k1 ?? 0,
      k2: args?.k2 ?? 0,
      k3: args?.k3 ?? 0,
      k4: args?.k4 ?? 0,
    };

    this.renderer = this.createSVGNode("feComposite");

    args?.targetNode?.append(this);
  }

  get operator(): CompositeOperator {
    return this.attributes.operator;
  }

  set operator(v: CompositeOperator) {
    this.triggerAttributeChanged(
      this.renderer,
      "operator",
      v,
      this.attributes.operator,
      Interp.stringInterp,
    );
  }

  getOperator() {
    return this.operator;
  }

  setOperator(operator: CompositeOperator): this {
    this.operator = operator;
    return this;
  }

  onOperatorChanged(
    listener: (vn: CompositeOperator, vo: CompositeOperator) => void,
  ) {
    return this.onAttributeChanged("operator", listener);
  }

  offOperatorChanged(
    listener: (vn: CompositeOperator, vo: CompositeOperator) => void,
  ) {
    return this.offAttributeChanged("operator", listener);
  }

  get k1(): number {
    return this.attributes.k1;
  }

  set k1(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "k1",
      v,
      this.attributes.k1,
      Interp.numberInterp,
    );
  }

  getK1() {
    return this.k1;
  }

  setK1(k1: number): this {
    this.k1 = k1;
    return this;
  }

  onK1Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k1", listener);
  }

  offK1Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k1", listener);
  }

  get k2(): number {
    return this.attributes.k2;
  }

  set k2(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "k2",
      v,
      this.attributes.k2,
      Interp.numberInterp,
    );
  }

  getK2() {
    return this.k2;
  }

  setK2(k2: number): this {
    this.k2 = k2;
    return this;
  }

  onK2Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k2", listener);
  }

  offK2Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k2", listener);
  }

  get k3(): number {
    return this.attributes.k3;
  }

  set k3(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "k3",
      v,
      this.attributes.k3,
      Interp.numberInterp,
    );
  }

  getK3() {
    return this.k3;
  }

  setK3(k3: number): this {
    this.k3 = k3;
    return this;
  }

  onK3Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k3", listener);
  }

  offK3Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k3", listener);
  }

  get k4(): number {
    return this.attributes.k4;
  }

  set k4(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "k4",
      v,
      this.attributes.k4,
      Interp.numberInterp,
    );
  }

  getK4() {
    return this.k4;
  }

  setK4(k4: number): this {
    this.k4 = k4;
    return this;
  }

  onK4Changed(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("k4", listener);
  }

  offK4Changed(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("k4", listener);
  }
}

import type { SDSVGNodeAttributes } from "@/node/svg-node";

import { Interp } from "@/animate/interp";
import { Context } from "@/animate/context";
import { SDSVGNode } from "@/node/svg-node";
import { Check } from "@/utility/check";
import { Color as C, SDAllColor, SDPacketColor } from "@/utility/color";

export type BasePathAttributes = SDSVGNodeAttributes & {
  markerStart: string;
  markerMid: string;
  markerEnd: string;
};

const BASE_PATH_ATTRIBUTES = {
  fill: C.white,
  fillOpacity: 0,
  stroke: C.black,
  strokeOpacity: 1,
  strokeWidth: 1,
  strokeDashOffset: 0,
  strokeDashArray: [1, 0],
  markerStart: "",
  markerMid: "",
  markerEnd: "",
};

export abstract class BasePath extends SDSVGNode {
  declare attributes: BasePathAttributes;

  getMarkerStart(): string {
    return this.attributes.markerStart;
  }
  setMarkerStart(marker: string): this {
    const marker_ = marker !== "" ? `url(#${marker})` : "";
    this.triggerAttributeChanged(
      this.renderer,
      "markerStart",
      marker_,
      this.attributes.markerStart,
      Interp.emptyInterp,
    );
    return this;
  }
  getMarkerMid(): string {
    return this.attributes.markerMid;
  }
  setMarkerMid(marker: string): this {
    const marker_ = marker !== "" ? `url(#${marker})` : "";
    this.triggerAttributeChanged(
      this.renderer,
      "markerMid",
      marker_,
      this.attributes.markerMid,
      Interp.emptyInterp,
    );
    return this;
  }
  getMarkerEnd(): string {
    return this.attributes.markerEnd;
  }
  setMarkerEnd(marker: string): this {
    const marker_ = marker !== "" ? `url(#${marker})` : "";
    this.triggerAttributeChanged(
      this.renderer,
      "markerEnd",
      marker_,
      this.attributes.markerEnd,
      Interp.emptyInterp,
    );
    return this;
  }

  /**
   * Makes this component gradually appear from the starting point to the ending point.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a line component appear with an arrow at the ending point.
   * line.startAnimate().pointStoT().endAnimate().arrow();
   */
  pointStoT() {
    const length = this.totalLength();
    return this.startSubAnimate()
      .subAnimate(0, 0)
      .setStrokeDashArray([0, length])
      .subAnimate(0, 1)
      .setStrokeDashArray([length, 0])
      .endSubAnimate();
  }
  /**
   * Makes this component gradually appear from the ending point to the starting point.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a line component appear with an arrow at the starting point.
   * line.startAnimate().pointTtoS().endAnimate().revArrow();
   */
  pointTtoS() {
    const length = this.totalLength();
    return this.startSubAnimate()
      .subAnimate(0, 0)
      .setStrokeDashArray([length, length])
      .setStrokeDashOffset(-length)
      .subAnimate(0, 1)
      .setStrokeDashArray([length, 0])
      .setStrokeDashOffset(0)
      .endSubAnimate();
  }
  /**
   * Makes this component gradually fade from the starting point to the ending point.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a line component with an arrow at the ending point fade.
   * line.startAnimate().fadeStoT().endAnimate().arrow(null);
   */
  fadeStoT() {
    const length = this.totalLength();
    return this.startSubAnimate()
      .subAnimate(0, 0)
      .setStrokeDashArray([length, length])
      .setStrokeDashOffset(0)
      .subAnimate(0, 1)
      .setStrokeDashArray([0, length])
      .setStrokeDashOffset(-length)
      .endSubAnimate();
  }
  /**
   * Makes this component gradually fade from the ending point to the starting point.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a lien component with an arrow at the starting point fade.
   * line.startAnimate().fadeTtoS().endAnimate().revArrow(null);
   */
  fadeTtoS() {
    const length = this.totalLength();
    return this.startSubAnimate()
      .subAnimate(0, 0)
      .setStrokeDashArray([length, 0])
      .subAnimate(0, 1)
      .setStrokeDashArray([0, length])
      .endSubAnimate();
  }
  /**
   * Gets the coordinates of a point along this path component at a specified fractinal position.
   * - 0 corresponds to the starting point of the path.
   * - 1 corresponds to the ending point of the path.
   * @param k - A numeric value between 0 and 1 representing the fraction of the path length.
   * @returns The coordinates of the point.
   */
  abstract getPointAtRate(k: number): [number, number];
  /**
   * Gets the coordinates of a point along this path component at a specified distance.
   * @param length - The cumulative distance from the start of the path component.
   * @returns The coordinates of the point.
   */
  abstract getPointAtLength(length: number): [number, number];
  /**
   * Gets the total length of this path component.
   * @returns The total length.
   */
  abstract totalLength(): number;

  createSVGNode(label: string, attributes?: { [key: string]: any }) {
    return super.createSVGNode(label, {
      ...BASE_PATH_ATTRIBUTES,
      ...(attributes || {}),
    });
  }
}

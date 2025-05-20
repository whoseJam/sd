import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { Line } from "@/Node/SVG/Path/LineSVG";

type XLocation = "x" | "cx" | "mx";
type YLocation = "y" | "cy" | "my";

export class BaseLink extends BaseCurve {
    constructor(parent: SDNode);
    sourceElement(): SDNode;
    sourceElement(element: SDNode): this;
    targetElement(): SDNode;
    targetElement(element: SDNode): this;
    sourceXLocation(): XLocation;
    sourceXLocation(location: XLocation): this;
    sourceYLocation(): YLocation;
    sourceYLocation(location: YLocation): this;
    targetXLocation(): XLocation;
    targetXLocation(location: XLocation): this;
    targetYLocation(): YLocation;
    targetYLocation(location: YLocation): this;
}

export function Link(sourceElement: SDNode, targetElement: SDNode, type: Line | BaseCurve, sourceXLocation: XLocation, sourceYLocation: YLocation, targetXLocation: XLocation, targetYLocation: YLocation): BaseLink;

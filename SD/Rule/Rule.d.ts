import { SDNode } from "@/Node/SDNode";
import { aside } from "@/Rule/Aside";
import { background, circleBackground } from "@/Rule/Background";
import { centerFixAspect, centerOnly, triangleCenterFixAspect } from "@/Rule/Center";
import { pointAtPathByLength, pointAtPathByRate } from "@/Rule/Path";

export type SDRule = (parent: SDNode, child: SDNode) => void;

export class Rule {
    static aside = aside;
    static background = background;
    static circleBackground = circleBackground;
    static centerOnly = centerOnly;
    static centerFixAspect = centerFixAspect;
    static triangleCenterFixAspect = triangleCenterFixAspect;
    static pointAtPathByRate = pointAtPathByRate;
    static pointAtPathByLength = pointAtPathByLength;
}

export function rule(): typeof Rule;

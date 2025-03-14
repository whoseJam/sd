import { aside } from "@/Rule/Aside";
import { background, circleBackground } from "@/Rule/Background";
import { center, centerFixAspect, centerOnly, triangleCenterFixAspect } from "@/Rule/Center";
import { pointAtPathByLength, pointAtPathByRate } from "@/Rule/Path";

export class Rule {
    static aside = aside;
    static background = background;
    static circleBackground = circleBackground;
    static center = center;
    static centerOnly = centerOnly;
    static centerFixAspect = centerFixAspect;
    static triangleCenterFixAspect = triangleCenterFixAspect;
    static pointAtPathByRate = pointAtPathByRate;
    static pointAtPathByLength = pointAtPathByLength;
}

export function rule() {
    return Rule;
}

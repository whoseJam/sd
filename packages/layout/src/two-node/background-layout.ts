import type { Circle, SizedBoxNode } from "@whosejam/sd-core";

export function BackgroundLayout(lhs: SizedBoxNode, rhs: SizedBoxNode) {
  rhs
    .setWidth(lhs.getLocalWidth())
    .setHeight(lhs.getLocalHeight())
    .setX(lhs.getLocalX())
    .setY(lhs.getLocalY());
}

export function CircleBackgroundLayout(lhs: Circle, rhs: Circle) {
  rhs.setR(lhs.getR()).setX(lhs.getLocalX()).setY(lhs.getLocalY());
}

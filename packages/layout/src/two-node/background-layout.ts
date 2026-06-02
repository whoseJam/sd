import type { Circle, SizedBoxNode } from "@sd/core";

export function BackgroundLayout(lhs: SizedBoxNode, rhs: SizedBoxNode) {
  rhs
    .setWidth(lhs.getWidth())
    .setHeight(lhs.getHeight())
    .setX(lhs.getX())
    .setY(lhs.getY());
}

export function CircleBackgroundLayout(lhs: Circle, rhs: Circle) {
  rhs.setR(lhs.getR()).setX(lhs.getX()).setY(lhs.getY());
}

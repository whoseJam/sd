import { SDNode, SDNodeWithRadius } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";

/**
 * This function positions and sizes the rhs node to exactly match the lhs's
 * position and dimensions, effectively creating a background or overlay effect.
 *
 * @param lhs - The reference node
 * @param rhs - The node to be sized and positioned
 *
 * @example
 * // Make source match target's bounds (background effect)
 * BackgroundLayout(backgroundNode, parentNode);
 *
 * @example
 * // Create a colored background for a container
 * const text = new sd.Text(svg, "hello");
 * const background = new sd.Rect(svg).fill(C.lightBlue);
 * BackgroundLayout(background, text);
 */
export function BackgroundLayout(lhs: SDNode, rhs: SDNode) {
    rhs.width(lhs.width()).height(lhs.height()).x(lhs.x()).y(lhs.y());
}

/**
 * This function positions and sizes a circular rhs node to exactly match the lhs's
 * position and radius, effectively creating a circular background or overlay effect.
 *
 * @param lhs - The circular node to be sized and positioned (must have r() method) (required)
 * @param rhs - The circular reference node (must have r() method) (required)
 *
 * @example
 * // Make circular source match target's bounds
 * CircleBackgroundLayout(circleBackground, circleNode);
 *
 * @example
 * // Create a colored circular background
 * const circle = new sd.Circle(svg).x(100).y(100).r(50);
 * const background = new sd.Circle(svg).fill("lightblue");
 * CircleBackgroundLayout(background, circle);
 */
export function CircleBackgroundLayout(lhs: Circle | SDNodeWithRadius, rhs: Circle | SDNodeWithRadius) {
    rhs.r(lhs.r()).x(lhs.x()).y(lhs.y());
}

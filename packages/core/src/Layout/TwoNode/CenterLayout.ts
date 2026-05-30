import { SDNode, SDNodeWithRadius } from "@/Node/SDNode";

interface CenterContentFitLayoutParam {
    rate?: number;
}

/**
 * This function positions the rhs node at the exact center of the lhs node.
 *
 * @param lhs - The reference node
 * @param rhs - The node to be centered
 */
export function CenterLayout(lhs: SDNode, rhs: SDNode) {
    rhs.center(lhs.center());
}

/**
 * This function positions the rhs node at the center of the lhs node and fits it
 * within the lhs's bounds. It automatically detects whether the lhs is a circle
 * (has radius) or a rectangle, and applies the appropriate content-fit algorithm.
 *
 * @param lhs - The reference node
 * @param rhs - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller rhs)
 */
export function CenterContentFitLayout(lhs: SDNode, rhs: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args ?? {};

    const circle = lhs as SDNodeWithRadius;
    if (typeof circle.r === "function") {
        CenterCircleContentFitLayout(lhs, rhs, { rate });
    } else {
        CenterRectContentFitLayout(lhs, rhs, { rate });
    }
}

/**
 * This function scales the rhs node to fit within the lhs rectangular bounds while maintaining
 * the rhs's aspect ratio, then centers it.
 *
 * @param lhs - The rectangular lhs node
 * @param rhs - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller rhs)
 *
 * Algorithm:
 * 1. Calculate the scaling factor to fit rhs within lhs bounds
 * 2. Apply the rate to make rhs smaller/larger
 * 3. Scale rhs dimensions
 * 4. Center rhs within lhs
 */
export function CenterRectContentFitLayout(lhs: SDNode, rhs: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args ?? {};

    const center = lhs.center();
    const [w, h] = [lhs.width(), lhs.height()];
    const cw = Math.max(rhs.width(), 1);
    const ch = Math.max(rhs.height(), 1);
    const k = Math.min(w / cw, h / ch) / rate;

    rhs.width(cw * k)
        .height(ch * k)
        .center(center);
}

/**
 * This function scales the rhs node to fit within the lhs circle's inscribed rectangle
 * while maintaining the rhs's aspect ratio, then centers it.
 *
 * @param lhs - The circular lhs node
 * @param rhs - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller rhs)
 *
 * Algorithm:
 * 1. Calculate the maximum rectangle that fits in the circle
 * 2. Scale based on rhs's aspect ratio
 * 3. Apply the rate factor
 * 4. Center rhs within lhs
 */
export function CenterCircleContentFitLayout(lhs: SDNode, rhs: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args ?? {};

    const center = lhs.center();
    const r = Math.min(lhs.width(), lhs.height()) / 2 / rate;
    const cw = Math.max(rhs.width(), 1);
    const ch = Math.max(rhs.height(), 1);
    const k = ch / cw;
    const w = 2 * Math.sqrt((r * r) / (k * k + 1));
    const h = w * k;

    rhs.width(w).height(h).center(center);
}

/**
 * This function scales the rhs node to fit within the lhs ellipse while maintaining
 * the rhs's aspect ratio, then centers it.
 *
 * @param lhs - The elliptical lhs node
 * @param rhs - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller rhs)
 *
 * Algorithm:
 * 1. Calculate ellipse semi-axes
 * 2. Find optimal scaling factor considering ellipse geometry
 * 3. Apply the rate factor
 * 4. Center rhs within lhs
 */
export function CenterEllipseContentFitLayout(lhs: SDNode, rhs: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args ?? {};

    const center = lhs.center();
    const [w, h] = [lhs.width() / 2 / rate, lhs.height() / 2 / rate];
    const cw = Math.max(rhs.width(), 1);
    const ch = Math.max(rhs.height(), 1);
    const k = Math.min((2 * w) / cw, (2 * h) / ch, (2 * Math.sqrt(w * h)) / Math.sqrt(cw * ch));

    rhs.width(cw * k)
        .height(ch * k)
        .center(center);
}

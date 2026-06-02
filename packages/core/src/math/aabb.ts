import type { TransformOrigin } from "@/node/node";

export type AABB = { x: number; y: number; width: number; height: number };

export function aabbCorners(b: AABB): Array<[number, number]> {
  return [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x + b.width, b.y + b.height],
    [b.x, b.y + b.height],
  ];
}

export function aabbFromCorners(pts: Array<[number, number]>): AABB {
  let minX = pts[0][0];
  let maxX = pts[0][0];
  let minY = pts[0][1];
  let maxY = pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (x < minX) minX = x;
    else if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    else if (y > maxY) maxY = y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function aabbContainsPoint(b: AABB, p: [number, number]): boolean {
  return (
    p[0] >= b.x &&
    p[0] <= b.x + b.width &&
    p[1] >= b.y &&
    p[1] <= b.y + b.height
  );
}

function resolveOrigin1D(
  v: number | string,
  axisStart: number,
  axisSize: number,
  axis: "x" | "y",
): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    if (v.endsWith("%")) return axisStart + (parseFloat(v) / 100) * axisSize;
    if (v === "center") return axisStart + axisSize / 2;
    if (axis === "x") {
      if (v === "left") return axisStart;
      if (v === "right") return axisStart + axisSize;
    } else {
      // math y is up: "top" is the high-y edge, "bottom" is the low-y edge.
      if (v === "top") return axisStart + axisSize;
      if (v === "bottom") return axisStart;
    }
  }
  return axisStart + axisSize / 2;
}

export function originPointIn(
  local: AABB,
  origin: TransformOrigin,
): [number, number] {
  return [
    resolveOrigin1D(origin[0], local.x, local.width, "x"),
    resolveOrigin1D(origin[1], local.y, local.height, "y"),
  ];
}

export type ResolvedTransform = {
  translate: [number, number];
  scale: [number, number];
  rotate: number;
  origin: [number, number];
};

export function composeTransform(
  local: AABB,
  attrs: {
    translate: [number, number];
    scale: [number, number];
    rotate: number;
    transformOrigin: TransformOrigin;
  },
): ResolvedTransform {
  return {
    translate: attrs.translate,
    scale: attrs.scale,
    // attributes.rotate is degrees (matches SVG `rotate(angle)` semantics).
    rotate: (attrs.rotate * Math.PI) / 180,
    origin: originPointIn(local, attrs.transformOrigin),
  };
}

// Applies a node's own transform to a point in its pre-transform local space,
// returning the point in its parent's coordinate space.
// Order: translate(-origin) -> rotate -> scale -> translate(matrix) -> translate(+origin).
export function transformPoint(
  p: [number, number],
  t: ResolvedTransform,
): [number, number] {
  let x = p[0] - t.origin[0];
  let y = p[1] - t.origin[1];
  if (t.rotate !== 0) {
    const c = Math.cos(t.rotate);
    const s = Math.sin(t.rotate);
    const rotX = x * c - y * s;
    const rotY = x * s + y * c;
    x = rotX;
    y = rotY;
  }
  x *= t.scale[0];
  y *= t.scale[1];
  x += t.translate[0] + t.origin[0];
  y += t.translate[1] + t.origin[1];
  return [x, y];
}

export function inverseTransformPoint(
  p: [number, number],
  t: ResolvedTransform,
): [number, number] {
  let x = p[0] - t.translate[0] - t.origin[0];
  let y = p[1] - t.translate[1] - t.origin[1];
  x /= t.scale[0];
  y /= t.scale[1];
  if (t.rotate !== 0) {
    const c = Math.cos(-t.rotate);
    const s = Math.sin(-t.rotate);
    const rotX = x * c - y * s;
    const rotY = x * s + y * c;
    x = rotX;
    y = rotY;
  }
  x += t.origin[0];
  y += t.origin[1];
  return [x, y];
}

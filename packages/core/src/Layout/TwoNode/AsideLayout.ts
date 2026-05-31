import type { SDNode } from "@/Node/SDNode";

type Align =
  | "tl"
  | "tc"
  | "tr"
  | "lt"
  | "lc"
  | "lb"
  | "bl"
  | "bc"
  | "br"
  | "rt"
  | "rc"
  | "rb";

interface AsideLayoutParam {
  align?: Align;
  gap?: number;
}

/**
 * This function positions the rhs node adjacent to the lhs node in one of 12 possible
 * positions around the lhs's perimeter, with a configurable gap.
 *
 * @param lhs - The reference node
 * @param rhs - The node to be positioned
 * @param args - Layout parameters
 * @param args.align - The alignment position (default: 'tc')
 * @param args.gap - The gap between the nodes (default: 5)
 */
export function AsideLayout(lhs: SDNode, rhs: SDNode, args: AsideLayoutParam) {
  const { align = "tc", gap = 5 } = args;
  if (align === "tl") {
    rhs.x(lhs.x()).my(lhs.y() - gap);
  } else if (align === "tc") {
    rhs.cx(lhs.cx()).my(lhs.y() - gap);
  } else if (align === "tr") {
    rhs.mx(lhs.mx()).my(lhs.y() - gap);
  } else if (align === "lt") {
    rhs.mx(lhs.x() - gap).y(lhs.y());
  } else if (align === "lc") {
    rhs.mx(lhs.x() - gap).cy(lhs.cy());
  } else if (align === "lb") {
    rhs.mx(lhs.x() - gap).my(lhs.my());
  } else if (align === "bl") {
    rhs.x(lhs.x()).y(lhs.my() + gap);
  } else if (align === "bc") {
    rhs.cx(lhs.cx()).y(lhs.my() + gap);
  } else if (align === "br") {
    rhs.mx(lhs.mx()).y(lhs.my() + gap);
  } else if (align === "rt") {
    rhs.x(lhs.mx() + gap).y(lhs.y());
  } else if (align === "rc") {
    rhs.x(lhs.mx() + gap).cy(lhs.cy());
  } else if (align === "rb") {
    rhs.x(lhs.mx() + gap).my(lhs.my());
  } else {
    throw new Error(`Invalid align: ${align}`);
  }
}

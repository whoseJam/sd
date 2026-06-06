import type { BoxNode } from "@sd/core";

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

export function AsideLayout(
  lhs: BoxNode,
  rhs: BoxNode,
  args: AsideLayoutParam,
) {
  const { align = "tc", gap = 5 } = args;
  if (align === "tl") {
    rhs.setX(lhs.getLocalX()).setMaxY(lhs.getLocalY() - gap);
  } else if (align === "tc") {
    rhs.setCx(lhs.getLocalCenterX()).setMaxY(lhs.getLocalY() - gap);
  } else if (align === "tr") {
    rhs.setMaxX(lhs.getLocalMaxX()).setMaxY(lhs.getLocalY() - gap);
  } else if (align === "lt") {
    rhs.setMaxX(lhs.getLocalX() - gap).setY(lhs.getLocalY());
  } else if (align === "lc") {
    rhs.setMaxX(lhs.getLocalX() - gap).setCy(lhs.getLocalCenterY());
  } else if (align === "lb") {
    rhs.setMaxX(lhs.getLocalX() - gap).setMaxY(lhs.getLocalMaxY());
  } else if (align === "bl") {
    rhs.setX(lhs.getLocalX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "bc") {
    rhs.setCx(lhs.getLocalCenterX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "br") {
    rhs.setMaxX(lhs.getLocalMaxX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "rt") {
    rhs.setX(lhs.getLocalMaxX() + gap).setY(lhs.getLocalY());
  } else if (align === "rc") {
    rhs.setX(lhs.getLocalMaxX() + gap).setCy(lhs.getLocalCenterY());
  } else if (align === "rb") {
    rhs.setX(lhs.getLocalMaxX() + gap).setMaxY(lhs.getLocalMaxY());
  } else {
    throw new Error(`Invalid align: ${align}`);
  }
}

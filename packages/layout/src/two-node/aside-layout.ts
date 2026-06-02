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
    rhs.setX(lhs.getLocalX()).setMy(lhs.getLocalY() - gap);
  } else if (align === "tc") {
    rhs.setCx(lhs.getLocalCenterX()).setMy(lhs.getLocalY() - gap);
  } else if (align === "tr") {
    rhs.setMx(lhs.getLocalMaxX()).setMy(lhs.getLocalY() - gap);
  } else if (align === "lt") {
    rhs.setMx(lhs.getLocalX() - gap).setY(lhs.getLocalY());
  } else if (align === "lc") {
    rhs.setMx(lhs.getLocalX() - gap).setCy(lhs.getLocalCenterY());
  } else if (align === "lb") {
    rhs.setMx(lhs.getLocalX() - gap).setMy(lhs.getLocalMaxY());
  } else if (align === "bl") {
    rhs.setX(lhs.getLocalX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "bc") {
    rhs.setCx(lhs.getLocalCenterX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "br") {
    rhs.setMx(lhs.getLocalMaxX()).setY(lhs.getLocalMaxY() + gap);
  } else if (align === "rt") {
    rhs.setX(lhs.getLocalMaxX() + gap).setY(lhs.getLocalY());
  } else if (align === "rc") {
    rhs.setX(lhs.getLocalMaxX() + gap).setCy(lhs.getLocalCenterY());
  } else if (align === "rb") {
    rhs.setX(lhs.getLocalMaxX() + gap).setMy(lhs.getLocalMaxY());
  } else {
    throw new Error(`Invalid align: ${align}`);
  }
}

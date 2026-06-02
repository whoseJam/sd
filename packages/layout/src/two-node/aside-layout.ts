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

export function AsideLayout(lhs: BoxNode, rhs: BoxNode, args: AsideLayoutParam) {
  const { align = "tc", gap = 5 } = args;
  if (align === "tl") {
    rhs.setX(lhs.getX()).setMy(lhs.getY() - gap);
  } else if (align === "tc") {
    rhs.setCx(lhs.getCx()).setMy(lhs.getY() - gap);
  } else if (align === "tr") {
    rhs.setMx(lhs.getMaxX()).setMy(lhs.getY() - gap);
  } else if (align === "lt") {
    rhs.setMx(lhs.getX() - gap).setY(lhs.getY());
  } else if (align === "lc") {
    rhs.setMx(lhs.getX() - gap).setCy(lhs.getCy());
  } else if (align === "lb") {
    rhs.setMx(lhs.getX() - gap).setMy(lhs.getMaxY());
  } else if (align === "bl") {
    rhs.setX(lhs.getX()).setY(lhs.getMaxY() + gap);
  } else if (align === "bc") {
    rhs.setCx(lhs.getCx()).setY(lhs.getMaxY() + gap);
  } else if (align === "br") {
    rhs.setMx(lhs.getMaxX()).setY(lhs.getMaxY() + gap);
  } else if (align === "rt") {
    rhs.setX(lhs.getMaxX() + gap).setY(lhs.getY());
  } else if (align === "rc") {
    rhs.setX(lhs.getMaxX() + gap).setCy(lhs.getCy());
  } else if (align === "rb") {
    rhs.setX(lhs.getMaxX() + gap).setMy(lhs.getMaxY());
  } else {
    throw new Error(`Invalid align: ${align}`);
  }
}

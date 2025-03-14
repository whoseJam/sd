import { SDRule } from "@/Rule/Rule";

type Align = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

export function aside(align: Align, gap: number): SDRule;

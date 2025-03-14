import { SDRule } from "@/Rule/Rule";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

export function pointAtPathByRate(k: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;
export function pointAtPathByLength(length: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;

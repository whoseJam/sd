import type {
  TextMappingArray,
  TextMappingLocation,
} from "@/node/text/base-text";
import type { TextView } from "@/node/text/text-engine/text-view";

import { SubtextView } from "@/node/text/text-engine/text-view";
import { make1d } from "@/utility/base";

function calculate(
  textView: TextView,
  deleted: Array<boolean>,
  pattern: TextMappingLocation,
): SubtextView {
  if (typeof pattern === "string") {
    for (let i = 0; i < textView.text.length; i++) {
      let matched = true;
      for (let j = 0; j < pattern.length && matched; j++)
        if (pattern[j] !== textView.text[i + j] || deleted[j]) matched = false;
      if (matched) return new SubtextView(textView, i, i + pattern.length - 1);
    }
  }
  console.warn(pattern);
  throw new Error("Subtext Not Found");
}

export function matchSubtext(
  textView: TextView,
  pattern: string | Array<string>,
): SubtextView {
  for (let i = 0; i < textView.text.length; i++) {
    let matched = true;
    for (let j = 0; j < pattern.length && matched; j++)
      if (pattern[j] !== textView.text[i + j]) matched = false;
    if (matched) return new SubtextView(textView, i, i + pattern.length - 1);
  }
  console.warn(pattern);
  throw new Error("Subtext Not Found");
}

export function match(
  sourceView: TextView,
  targetView: TextView,
  mappings: TextMappingArray,
): Array<[SubtextView, SubtextView]> {
  const matchings = [];
  const sourceDeleted = make1d(sourceView.text.length, false);
  const targetDeleted = make1d(targetView.text.length, false);
  for (const mapping of mappings) {
    const source = mapping.source;
    const target = mapping.target;
    const sourceSubtextView = calculate(sourceView, sourceDeleted, source);
    const targetSubtextView = calculate(targetView, targetDeleted, target);
    targetSubtextView.setStyle(sourceSubtextView.getStyle());
    matchings.push(sourceSubtextView, targetSubtextView);
  }
  const sourceSet = new Set<number>();
  const targetSet = new Set<number>();
  sourceDeleted.forEach((value, i) => {
    if (!value) sourceSet.add(i);
  });
  targetDeleted.forEach((value, i) => {
    if (!value) targetSet.add(i);
  });
  const sourceSubtextView = new SubtextView(sourceView, sourceSet);
  const targetSubtextView = new SubtextView(targetView, targetSet);
  targetSubtextView.setStyle(sourceSubtextView.getStyle());
  matchings.push([sourceSubtextView, targetSubtextView]);
  return matchings;
}

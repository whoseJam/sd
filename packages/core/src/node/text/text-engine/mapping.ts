import type {
  TextMappingArray,
  TextMappingLocation,
} from "@/node/text/base-text";
import type { TextView } from "@/node/text/text-engine/text-view";

import { SubtextView } from "@/node/text/text-engine/text-view";
import { make1d } from "@/utility/base";

function locateUnmatchedSubtext(
  textView: TextView,
  deleted: Array<boolean>,
  pattern: TextMappingLocation,
): SubtextView {
  // Treat `string` and `Array<string>` uniformly: both expose `.length`
  // and indexed access, with each unit being one glyph identifier.
  // Math glyph streams use hex codepoints ("3F" for "?"), so the caller
  // (Math.setText) converts string patterns via parseToHTML before
  // handing them off; this branch accepts the converted array form too.
  if (typeof pattern === "string" || Array.isArray(pattern)) {
    for (let i = 0; i < textView.text.length; i++) {
      let matched = true;
      for (let j = 0; j < pattern.length && matched; j++)
        // deleted is indexed by textView position (i + j), not by
        // pattern position (j) — earlier code conflated the two.
        if (pattern[j] !== textView.text[i + j] || deleted[i + j])
          matched = false;
      if (matched) {
        // Mark the matched range so subsequent mappings cannot reuse
        // the same chars and the trailing unmapped-union pass excludes
        // them.
        for (let j = 0; j < pattern.length; j++) deleted[i + j] = true;
        return SubtextView.range(textView, i, i + pattern.length - 1);
      }
    }
    // Include source text snippet in the error so callers can see what
    // the matcher was actually working against (hex codepoints for Math,
    // raw chars for Text); much easier to diagnose than a bare pattern.
    const preview = Array.isArray(textView.text)
      ? textView.text.slice(0, 30).join(" ")
      : String(textView.text).slice(0, 60);
    throw new Error(
      `Subtext Not Found: ${JSON.stringify(pattern)} (in: "${preview}${textView.text.length > 30 ? "..." : ""}")`,
    );
  }
  throw new Error(`Subtext Not Found: ${JSON.stringify(pattern)}`);
}

export function matchSubtext(
  textView: TextView,
  pattern: string | Array<string>,
  occurrence: number = 0,
): SubtextView {
  let remaining = occurrence;
  for (let i = 0; i < textView.text.length; i++) {
    let matched = true;
    for (let j = 0; j < pattern.length && matched; j++)
      if (pattern[j] !== textView.text[i + j]) matched = false;
    if (matched) {
      if (remaining === 0)
        return SubtextView.range(textView, i, i + pattern.length - 1);
      remaining--;
    }
  }
  throw new Error(`Subtext Not Found: ${JSON.stringify(pattern)}`);
}

export function mapSubtextsBetweenViews(
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
    const sourceSubtextView = locateUnmatchedSubtext(
      sourceView,
      sourceDeleted,
      source,
    );
    const targetSubtextView = locateUnmatchedSubtext(
      targetView,
      targetDeleted,
      target,
    );
    targetSubtextView.setStyle(sourceSubtextView.getStyle());
    matchings.push([sourceSubtextView, targetSubtextView]);
  }
  const sourceSet = new Set<number>();
  const targetSet = new Set<number>();
  sourceDeleted.forEach((value, i) => {
    if (!value) sourceSet.add(i);
  });
  targetDeleted.forEach((value, i) => {
    if (!value) targetSet.add(i);
  });
  const sourceSubtextView = SubtextView.sparse(sourceView, sourceSet);
  const targetSubtextView = SubtextView.sparse(targetView, targetSet);
  targetSubtextView.setStyle(sourceSubtextView.getStyle());
  matchings.push([sourceSubtextView, targetSubtextView]);
  return matchings;
}

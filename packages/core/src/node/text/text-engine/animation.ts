import type { LazyInterpFunction } from "@/animate/interp";
import type { BaseText } from "@/node/text/base-text";
import type {
  PathStyle,
  SubtextView,
  TextView,
} from "@/node/text/text-engine/text-view";

import { Action } from "@/animate/action";
import { Animate } from "@/animate/animate";
import { createTextView } from "@/node/text/text-engine/text-view";

export function buildAnimation(
  text: BaseText,
  source: { text: string | Array<string>; styles?: Array<PathStyle> },
  target: { text: string | Array<string> },
  process: (
    sourceView: TextView,
    targetView: TextView,
  ) => Array<[SubtextView, SubtextView]>,
  postProcess: LazyInterpFunction,
  animatedKey: string,
) {
  const sourceView = createTextView(source.text, { styles: source.styles });
  const targetView = createTextView(target.text, {});
  const mappings = process(sourceView, targetView);
  const l = text.delay();
  const r = text.delay() + text.duration();
  Animate.push(
    new Action(
      l,
      r,
      mappings.map((mapping) => mapping[0]),
      mappings.map((mapping) => mapping[1]),
      postProcess,
      text.timingFunction,
      text,
      "text:" + animatedKey,
    ),
  );
  return targetView.styles;
}

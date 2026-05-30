import { Action } from "@/Animate/Action";
import { Animate } from "@/Animate/Animate";
import { createTextView, PathStyle, SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { LazyInterpFunction } from "@/Animate/Interp";
import { BaseText } from "@/Node/Text/BaseText";

export function buildAnimation(
    text: BaseText,
    source: { text: string | Array<string>; styles?: Array<PathStyle> },
    target: { text: string | Array<string> },
    process: (sourceView: TextView, targetView: TextView) => Array<[SubtextView, SubtextView]>,
    postProcess: LazyInterpFunction,
    animatedKey: string
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
            mappings.map(mapping => mapping[0]),
            mappings.map(mapping => mapping[1]),
            postProcess,
            text._.timingFunction,
            text,
            "text:" + animatedKey
        )
    );
    return targetView.styles;
}

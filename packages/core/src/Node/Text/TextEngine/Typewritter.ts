import { SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { getTextPaths, getTextPaths2 } from "@/Node/Text/TextEngine/Path";
import { Animate as A } from "@/Animate/Animate";
import { RenderNode } from "@/Renderer/RenderNode";
import { Text } from "@/Node/Text/Text";
import { Action } from "@/Animate/Action";

export function typewritterProcess() {
    return function (source: TextView, target: TextView): Array<[SubtextView, SubtextView]> {
        return [[source.asSubtextView(), target.asSubtextView()]];
    };
}

export function typewritterPostProcess(text: Text, targetLayer: RenderNode) {
    return function (l: number, r: number, source: Array<SubtextView>, target: Array<SubtextView>) {
        const sourcePaths = getTextPaths2(text, l, A.getAttribute(text, "text", r, text.getText()));
        const targetPaths = getTextPaths(text, r);
        const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
        const characters = [];
        for (let i = 0; i < sourcePaths.length; i++) {
            const character = RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
            const target = targetPaths[i];
            character.setAttribute("d", target.d);
            characters.push(character);
        }

        new Action(
            l,
            r,
            0,
            1,
            function (t: number) {
                const time = 1.0 / characters.length;
                for (let i = 0; i < characters.length; i++) {
                    const k = this.reverse ? (characters.length - i - 0.5) * time : (i + 0.5) * time;
                    if (t >= k) characters[i].setAttribute("opacity", this.target);
                    else characters[i].setAttribute("opacity", this.source);
                }
            },
            this.timingFunction,
            text,
            "typewritter"
        );

        group.__animate(r, r).remove();
    };
}

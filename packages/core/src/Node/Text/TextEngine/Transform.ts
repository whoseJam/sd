import { match } from "@/Node/Text/TextEngine/Mapping";
import { BaseText, TextMapping, processMapping } from "@/Node/Text/BaseText";
import { PathStyle, SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { getPaths } from "@/Node/Text/TextEngine/Path";
import { RenderNode } from "@/Renderer/RenderNode";
import { Action } from "@/Animate/Action";
import { Interp, lazyInterp } from "@/Animate/Interp";
import { Animate as A } from "@/Animate/Animate";

export function transformProcess(mapping: TextMapping) {
    return function (source: TextView, target: TextView) {
        return match(source, target, processMapping(mapping));
    };
}

export function transformPostProcess(text: BaseText, targetLayer: RenderNode) {
    return lazyInterp(function (l: number, r: number, source: Array<SubtextView>, target: Array<SubtextView>) {
        if (l === r) return;
        const createAction = (character: RenderNode, source: any, target: any, interp: any, animatedKey: string) => {
            if (animatedKey === "transform") {
                const source_ = source as SVGMatrix;
                const target_ = target as SVGMatrix;
                if (source_.toString() === target_.toString()) return;
            }
            A.push(
                new Action(
                    l,
                    r,
                    source,
                    target,
                    interp(character, animatedKey),
                    this.timingFunction,
                    character,
                    animatedKey
                )
            );
        };

        const sourcePaths = getPaths(text, l);
        const targetPaths = getPaths(text, r);

        for (let i = 0; i < source.length; i++) {
            const sourceSubtext = source[i];
            const targetSubtext = target[i];
            const sourceStyles: Array<PathStyle> = A.getAttribute(text, "subtextStyles", l);
            const targetStyles: Array<PathStyle> = A.getAttribute(text, "subtextStyles", r);
            const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
            const mapping = buildMapping(sourceSubtext.count(), targetSubtext.count());
            for (const [sourceIndex, targetIndex] of mapping) {
                const character = RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
                const source = sourcePaths[sourceIndex];
                const target = targetPaths[targetIndex];
                if (sourceIndex === undefined) {
                    if (!target) continue;
                    character.setAttribute("d", target.d);
                    createAction(character, 0, 1, Interp.numberInterp, "opacity");
                    continue;
                } else if (targetIndex === undefined) {
                    if (!source) continue;
                    character.setAttribute("d", source.d);
                    createAction(character, 1, 0, Interp.numberInterp, "opacity");
                    continue;
                } else if (source === undefined && target === undefined) {
                    continue;
                } else if (source === undefined) {
                    character.setAttribute("d", target.d);
                    createAction(character, 0, 1, Interp.numberInterp, "opacity");
                    continue;
                } else if (target === undefined) {
                    character.setAttribute("d", source.d);
                    createAction(character, 1, 0, Interp.numberInterp, "opacity");
                    continue;
                }
                character.setAttribute("d", source.d);
                character.setAttribute("transform", source.transform);
                createAction(character, source.d, target.d, Interp.pathInterp, "d");
                createAction(character, source.transform, target.transform, Interp.matrixInterp, "transform");
                const sourceStyle = sourceStyles[sourceIndex].styleAt(text, l);
                const targetStyle = targetStyles[targetIndex].styleAt(text, r);
                createAction(character, sourceStyle.fill, targetStyle.fill, Interp.colorInterp, "fill");
                createAction(character, sourceStyle.stroke, targetStyle.stroke, Interp.colorInterp, "stroke");
                createAction(
                    character,
                    sourceStyle.strokeWidth,
                    targetStyle.strokeWidth,
                    Interp.numberInterp,
                    "stroke-width"
                );
            }
            group.__animate(r, r).remove();
        }
    });
}

function buildMapping(sourceCount: number, targetCount: number): Array<[number, number]> {
    const mapping: Array<[number, number]> = [];
    if (sourceCount < targetCount) {
        console.log("aaa");
        const count = targetCount - sourceCount;
        const gap = Math.floor(sourceCount / count);
        if (sourceCount === 0) {
            for (let i = 0; i < targetCount; i++) mapping.push([undefined, i]);
            return mapping;
        }
        if (gap > 0) {
            let current = 0;
            for (let i = 0; i < sourceCount; i++) {
                if (i % gap === 0 && current < count) {
                    mapping.push([i, mapping.length]);
                    current++;
                }
                mapping.push([i, mapping.length]);
            }
            return mapping;
        }
        if (gap === 0) {
            let current = 0;
            const copy = Math.ceil(count / sourceCount);
            for (let i = 0; i < sourceCount; i++) {
                for (let j = 1; j <= copy && current < count; j++) {
                    mapping.push([i, mapping.length]);
                    current++;
                }
                mapping.push([i, mapping.length]);
            }
            return mapping;
        }
    }
    if (sourceCount === targetCount) {
        for (let i = 0; i < sourceCount; i++) mapping.push([i, i]);
        return mapping;
    }
    if (sourceCount > targetCount) {
        const count = sourceCount - targetCount;
        const gap = Math.floor(targetCount / count);
        if (targetCount === 0) {
            for (let i = 0; i < targetCount; i++) mapping.push([i, undefined]);
            return mapping;
        }
        if (gap > 0) {
            let current = 0;
            for (let i = 0; i < targetCount; i++) {
                if (i % gap === 0 && current < count) {
                    mapping.push([mapping.length, i]);
                    current++;
                }
                mapping.push([mapping.length, i]);
            }
            return mapping;
        }
        if (gap === 0) {
            let current = 0;
            const copy = Math.ceil(count / targetCount);
            for (let i = 0; i < targetCount; i++) {
                for (let j = 1; j <= copy && current < count; j++) {
                    mapping.push([mapping.length, i]);
                    current++;
                }
                mapping.push([mapping.length, i]);
            }
            return mapping;
        }
    }
}

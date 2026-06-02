import type { BaseText, TextMapping } from "@/node/text/base-text";
import type {
  PathStyle,
  SubtextView,
  TextView,
} from "@/node/text/text-engine/text-view";

import { Action } from "@/animate/action";
import { Animate as A } from "@/animate/animate";
import { Interp, lazyInterp } from "@/animate/interp";
import { processMapping } from "@/node/text/base-text";
import { match } from "@/node/text/text-engine/mapping";
import { getPaths } from "@/node/text/text-engine/path";
import { RenderNode } from "@/renderer/render-node";

export function transformProcess(mapping: TextMapping) {
  return function (source: TextView, target: TextView) {
    return match(source, target, processMapping(mapping));
  };
}

export function transformPostProcess(text: BaseText, targetLayer: RenderNode) {
  return lazyInterp(function (
    l: number,
    r: number,
    source: Array<SubtextView>,
    target: Array<SubtextView>,
  ) {
    if (l === r) return;
    const createAction = (
      character: RenderNode,
      source: any,
      target: any,
      interp: any,
      animatedKey: string,
    ) => {
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
          animatedKey,
        ),
      );
    };

    const sourcePaths = getPaths(text, l);
    const targetPaths = getPaths(text, r);

    for (let i = 0; i < source.length; i++) {
      const sourceSubtext = source[i];
      const targetSubtext = target[i];
      const sourceStyles: Array<PathStyle> = A.getAttribute(
        text,
        "subtextStyles",
        l,
      );
      const targetStyles: Array<PathStyle> = A.getAttribute(
        text,
        "subtextStyles",
        r,
      );
      const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
      // SubtextView indices are positions within the FULL text (the
      // subtext picks out a subset). buildMapping returns LOCAL indices
      // into the subtext though; we translate them back to absolute
      // positions before looking into sourcePaths / sourceStyles, both
      // of which are keyed by absolute char index.
      const sourcePositions: number[] = [];
      sourceSubtext.__iterate((p) => sourcePositions.push(p));
      const targetPositions: number[] = [];
      targetSubtext.__iterate((p) => targetPositions.push(p));
      const mapping = buildMapping(
        sourcePositions.length,
        targetPositions.length,
      );
      const fadePath = (
        node: RenderNode,
        d: string,
        opacityFrom: number,
        opacityTo: number,
      ) => {
        node.setAttribute("d", d);
        createAction(node, opacityFrom, opacityTo, Interp.numberInterp, "opacity");
      };
      const makePath = () =>
        RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
      for (const [localSourceIndex, localTargetIndex] of mapping) {
        const sourceIndex =
          localSourceIndex === undefined
            ? undefined
            : sourcePositions[localSourceIndex];
        const targetIndex =
          localTargetIndex === undefined
            ? undefined
            : targetPositions[localTargetIndex];
        const source =
          sourceIndex === undefined ? undefined : sourcePaths[sourceIndex];
        const target =
          targetIndex === undefined ? undefined : targetPaths[targetIndex];
        if (sourceIndex === undefined) {
          if (target) fadePath(makePath(), target.d, 0, 1);
          continue;
        }
        if (targetIndex === undefined) {
          if (source) fadePath(makePath(), source.d, 1, 0);
          continue;
        }
        if (source === undefined && target === undefined) continue;
        if (source === undefined) {
          fadePath(makePath(), target.d, 0, 1);
          continue;
        }
        if (target === undefined) {
          fadePath(makePath(), source.d, 1, 0);
          continue;
        }
        // Both chars exist — one path node, morph d directly. Sub-path
        // alignment (multi-M glyphs like "o" matched against single-M
        // ones like "1") is handled inside PathEngine.toCubics. Keeping
        // a single <path> element preserves SVG fill-rule semantics so
        // glyph holes (o's inner) render as actual holes.
        const character = makePath();
        character.setAttribute("d", source.d);
        character.setAttribute("transform", source.transform);
        createAction(character, source.d, target.d, Interp.pathInterp, "d");
        createAction(
          character,
          source.transform,
          target.transform,
          Interp.matrixInterp,
          "transform",
        );
        const sourceStyle = sourceStyles[sourceIndex].styleAt(text, l);
        const targetStyle = targetStyles[targetIndex].styleAt(text, r);
        createAction(
          character,
          sourceStyle.fill,
          targetStyle.fill,
          Interp.colorInterp,
          "fill",
        );
        createAction(
          character,
          sourceStyle.stroke,
          targetStyle.stroke,
          Interp.colorInterp,
          "stroke",
        );
        createAction(
          character,
          sourceStyle.strokeWidth,
          targetStyle.strokeWidth,
          Interp.numberInterp,
          "stroke-width",
        );
      }
      group.__animate(r, r).remove();
    }
  });
}

function buildMapping(
  sourceCount: number,
  targetCount: number,
): Array<[number, number]> {
  const mapping: Array<[number, number]> = [];
  if (sourceCount < targetCount) {
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

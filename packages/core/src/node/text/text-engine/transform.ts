import type {
  BaseText,
  TextMapping,
  TextMappingArray,
} from "@/node/text/base-text";
import type {
  PathStyle,
  SubtextView,
  TextView,
} from "@/node/text/text-engine/text-view";
import type { SDRGBAColor } from "@/utility/color";

import { Animate as A, pushAction } from "@/animate/animate";
import { Interp, lazyInterp } from "@/animate/interp";
import { processMapping } from "@/node/text/base-text";
import { mapSubtextsBetweenViews } from "@/node/text/text-engine/mapping";
import { getPaths } from "@/node/text/text-engine/path";
import { RenderNode } from "@/renderer/render-node";

export function transformProcess(mapping: TextMapping | TextMappingArray | undefined) {
  return function (source: TextView, target: TextView) {
    if (mapping === undefined) return mapSubtextsBetweenViews(source, target, []);
    const array = Array.isArray(mapping) && mapping.length > 0 && typeof mapping[0] === "object" && "source" in mapping[0]
      ? (mapping as TextMappingArray)
      : processMapping(mapping as TextMapping);
    return mapSubtextsBetweenViews(source, target, array);
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
    const timing = this.timingFunction;

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
      // Morph group is a sibling of <text>, not a child — so it doesn't inherit the Text's
      // opacity for free. Mirror it onto the group, plus an action if it animates in [l, r].
      const opacityAtL = A.getAttribute(text, "opacity", l, text.getOpacity());
      const opacityAtR = A.getAttribute(text, "opacity", r, text.getOpacity());
      group.setAttribute("opacity", opacityAtL);
      if (opacityAtL !== opacityAtR) {
        pushAction({
          entity: group,
          key: "opacity",
          l,
          r,
          from: opacityAtL,
          to: opacityAtR,
          interp: Interp.numberInterp,
          timing,
        });
      }
      // SubtextView indices are positions within the FULL text (the
      // subtext picks out a subset). alignCharacterSequence returns LOCAL
      // indices into the subtext though; we translate them back to
      // absolute positions before looking into sourcePaths / sourceStyles,
      // both of which are keyed by absolute char index.
      const sourcePositions: number[] = [];
      sourceSubtext.iterate((p) => sourcePositions.push(p));
      const targetPositions: number[] = [];
      targetSubtext.iterate((p) => targetPositions.push(p));
      const mapping = alignCharacterSequence(
        sourcePositions.length,
        targetPositions.length,
      );
      // Style stays constant during a fade; write attrs once. Without this the path inherits
      // SVG default (black) regardless of the Text's fill.
      const fadePath = (
        node: RenderNode,
        d: string,
        style: PathStyle,
        opacityFrom: number,
        opacityTo: number,
      ) => {
        node.setAttribute("d", d);
        node.setAttribute("fill", style.fill);
        node.setAttribute("stroke", style.stroke);
        node.setAttribute("stroke-width", style.strokeWidth);
        pushAction({
          entity: node,
          key: "opacity",
          l,
          r,
          from: opacityFrom,
          to: opacityTo,
          interp: Interp.numberInterp,
          timing,
        });
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
        const sourceStyleResolved =
          sourceIndex === undefined
            ? undefined
            : sourceStyles[sourceIndex].styleAt(text, l);
        const targetStyleResolved =
          targetIndex === undefined
            ? undefined
            : targetStyles[targetIndex].styleAt(text, r);
        if (sourceIndex === undefined) {
          if (target) fadePath(makePath(), target.d, targetStyleResolved, 0, 1);
          continue;
        }
        if (targetIndex === undefined) {
          if (source) fadePath(makePath(), source.d, sourceStyleResolved, 1, 0);
          continue;
        }
        if (source === undefined && target === undefined) continue;
        if (source === undefined) {
          fadePath(makePath(), target.d, targetStyleResolved, 0, 1);
          continue;
        }
        if (target === undefined) {
          fadePath(makePath(), source.d, sourceStyleResolved, 1, 0);
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
        // Seed style attrs so frame-0 renders in source style; without this the action loop's
        // pre-tick state is the SVG default (black) and matched chars flash black for one frame.
        character.setAttribute("fill", sourceStyleResolved.fill);
        character.setAttribute("stroke", sourceStyleResolved.stroke);
        character.setAttribute("stroke-width", sourceStyleResolved.strokeWidth);
        pushAction({
          entity: character,
          key: "d",
          l,
          r,
          from: source.d,
          to: target.d,
          interp: Interp.pathInterp,
          timing,
        });
        if (source.transform.toString() !== target.transform.toString()) {
          pushAction({
            entity: character,
            key: "transform",
            l,
            r,
            from: source.transform,
            to: target.transform,
            interp: Interp.matrixInterp,
            timing,
          });
        }
        pushAction({
          entity: character,
          key: "fill",
          l,
          r,
          from: sourceStyleResolved.fill as SDRGBAColor,
          to: targetStyleResolved.fill as SDRGBAColor,
          interp: Interp.colorInterp,
          timing,
        });
        pushAction({
          entity: character,
          key: "stroke",
          l,
          r,
          from: sourceStyleResolved.stroke as SDRGBAColor,
          to: targetStyleResolved.stroke as SDRGBAColor,
          interp: Interp.colorInterp,
          timing,
        });
        pushAction({
          entity: character,
          key: "stroke-width",
          l,
          r,
          from: sourceStyleResolved.strokeWidth as number,
          to: targetStyleResolved.strokeWidth as number,
          interp: Interp.numberInterp,
          timing,
        });
      }
      group.__animate(r, r).remove();
    }
  });
}

function alignCharacterSequence(
  sourceCount: number,
  targetCount: number,
): Array<[number | undefined, number | undefined]> {
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
      for (let i = 0; i < sourceCount; i++) mapping.push([i, undefined]);
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

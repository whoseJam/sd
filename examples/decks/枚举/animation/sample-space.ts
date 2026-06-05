import * as sd from "@/sd";

import { arrow } from "./arrow";
import { Box } from "./box";
import { FocusFrame } from "./focus-frame";
import { ValueStack } from "./value-stack";

// Sample-space diagram template:
//   [stack₁] × [stack₂] × ... × [stackₖ]  →  [process]  →  [answer]
// with a "样本空间" focus frame around the stacks.
//
// Multi-stack form (k ≥ 2) shows the cartesian product. Arrows only come
// from the *last* stack (the one nearest the process box) — drawing one
// arrow per item of every stack would clutter the figure without adding
// information.
//
// Pure static composition. Each anim file just wires data in.

const C = sd.color();
const E = sd.easing();

export interface StackSpec {
  items: ReadonlyArray<string>;
  label?: string;
}

export interface SampleSpaceOpts {
  svg: sd.Group;
  stacks: ReadonlyArray<StackSpec>;
  process: { text: string; width?: number; math?: boolean };
  answer?: { text: string; width?: number };
  elementWidth?: number;
  elementHeight?: number;
  stackGap?: number;
  focusLabel?: string;
}

export interface SampleSpaceHandles {
  stacks: ValueStack[];
  processBox: Box;
  answerBox?: Box;
  focus: FocusFrame;
}

export function sampleSpace(opts: SampleSpaceOpts): SampleSpaceHandles {
  const elementWidth = opts.elementWidth ?? 70;
  const elementHeight = opts.elementHeight ?? 26;
  const stackGap = opts.stackGap ?? 40;
  const processGap = 80;
  const answerGap = 80;
  const focusPadding = 14;

  // Layout left-to-right starting at the origin. sd-element auto-fits
  // viewBox to the rendered AABB, so we don't need to center math
  // coordinates ourselves — placing everything in the positive quadrant
  // works just as well.
  const processWidth = opts.process.width ?? 100;
  const answerWidth = opts.answer ? opts.answer.width ?? 70 : 0;
  const x0 = 0;
  const topY = 0;
  const stacks: ValueStack[] = [];

  for (let i = 0; i < opts.stacks.length; i++) {
    const stack = opts.stacks[i];
    const cx = x0 + elementWidth / 2 + i * (elementWidth + stackGap);
    stacks.push(
      new ValueStack({
        targetNode: opts.svg,
        items: stack.items,
        cx,
        topY,
        elementWidth,
        elementHeight,
        label: stack.label,
      }),
    );
    if (i > 0) {
      const prev = stacks[i - 1];
      const cur = stacks[i];
      const midX = (prev.right() + cur.left()) / 2;
      new sd.Text({
        targetNode: opts.svg,
        text: "×",
        cx: midX,
        cy: prev.midY(),
        fontSize: 22,
        fill: C.darkButtonGrey,
      });
    }
  }

  const lastStack = stacks[stacks.length - 1];
  const processCx = lastStack.right() + processGap + processWidth / 2;
  const processY = lastStack.midY() - elementHeight * 1.2;
  const processBox = new Box({
    targetNode: opts.svg,
    x: processCx - processWidth / 2,
    y: processY,
    width: processWidth,
    height: opts.process.math ? elementHeight * 2 : elementHeight * 1.5,
    text: opts.process.text,
    math: opts.process.math,
    fontSize: opts.process.math ? 16 : 14,
  });

  let answerBox: Box | undefined;
  if (opts.answer) {
    const answerCx = processBox.right() + answerGap + answerWidth / 2;
    const answerY = processBox.cy() - elementHeight / 2;
    answerBox = new Box({
      targetNode: opts.svg,
      x: answerCx - answerWidth / 2,
      y: answerY,
      width: answerWidth,
      height: elementHeight,
      text: opts.answer.text,
    });
  }

  // Arrows from each item of the last stack to the process box's left edge.
  // Spread the arrival points evenly along the process box's left edge.
  const realItems = lastStack.boxes.filter((b): b is Box => b instanceof Box);
  for (let i = 0; i < realItems.length; i++) {
    const fromBox = realItems[i];
    const t = realItems.length === 1 ? 0.5 : i / (realItems.length - 1);
    const yArrival = processBox.bottom() + t * processBox.height;
    arrow(opts.svg, {
      from: { x: fromBox.right(), y: fromBox.cy() },
      to: { x: processBox.left(), y: yArrival },
      headSize: 6,
      stroke: C.silver,
    });
  }

  if (answerBox) {
    arrow(opts.svg, {
      from: { x: processBox.right(), y: processBox.cy() },
      to: { x: answerBox.left(), y: answerBox.cy() },
      headSize: 8,
    });
  }

  // Focus frame around all the stacks, including their label headers.
  const fx = stacks[0].left() - focusPadding;
  const fyTop = topY + focusPadding + 6;
  const fyBottom = Math.min(...stacks.map((s) => s.bottomY)) - focusPadding;
  const fw = lastStack.right() + focusPadding - fx;
  const fh = fyTop - fyBottom;
  const focus = new FocusFrame({
    targetNode: opts.svg,
    x: fx,
    y: fyBottom,
    width: fw,
    height: fh,
    label: opts.focusLabel ?? "样本空间",
  });
  focus.group
    .startAnimate({ delay: 240, duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  return { stacks, processBox, answerBox, focus };
}

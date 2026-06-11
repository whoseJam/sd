import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export const NEUTRAL = C.darkButtonGrey;
export const NEUTRAL_FILL = "#fdecd9";
export const NEUTRAL_STROKE = C.darkOrange;
export const ACCENT = C.steelBlue;
export const ACCENT_FILL = C.darkOrange;
export const ACCENT_TEXT = "#ffffff";
export const GHOST = "#e6c5a3";

export const OCEAN = C.steelBlue;
export const LAND = C.green;
export const MOUNTAIN = "#a89c8e";
export const FERTILE = "#e8d8a8";
export const BARREN = "#8e745a";
export const KING = "#b4610e";
export const CANNON = "#8b3a3a";
export const CORN = "#d4a017";
export const INVALID = "#c44";

export const DUR = 280;

type Anim = sd.Rect | sd.Circle | sd.Text | sd.Math | sd.Path | sd.Line;

export function fadeIn(el: Anim, delay = 0, dur = DUR) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

export function fadeOpacity(el: Anim, opacity: number, delay = 0, dur = DUR) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(opacity)
    .endAnimate();
}

export function setFill(
  el: sd.Rect | sd.Circle | sd.Text,
  color: string,
  delay = 0,
  dur = DUR,
) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

export function setStroke(
  el: sd.Rect | sd.Circle | sd.Path,
  color: string,
  delay = 0,
  dur = DUR,
) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setStroke(color)
    .endAnimate();
}

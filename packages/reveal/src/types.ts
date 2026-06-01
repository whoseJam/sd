// Minimal type surface for reveal.js — we only declare what our plugins touch.
// reveal.js ships no .d.ts; rather than pull a community @types package we
// hand-roll the small slice we actually use.

export interface RevealPlugin {
  id: string;
  init: (reveal: RevealApi) => void | Promise<unknown>;
}

export interface SlideChangedEvent {
  currentSlide: HTMLElement;
  previousSlide: HTMLElement | null;
  indexh: number;
  indexv: number;
}

export interface RevealConfig {
  katex?: Record<string, unknown>;
  mathjax2?: Record<string, unknown>;
  math?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RevealApi {
  addEventListener(
    event: "slidechanged",
    cb: (event: SlideChangedEvent) => void,
  ): void;
  addEventListener(event: string, cb: (event: Event) => void): void;
  layout(): void;
  getConfig(): RevealConfig;
  getRevealElement(): HTMLElement;
  getSlidesElement(): HTMLElement;
  isReady(): boolean;
  on(event: string, cb: () => void): void;
}

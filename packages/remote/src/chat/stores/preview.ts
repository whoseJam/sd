import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import type { LoaderMessage, PreviewState, ProgressEntry } from "../types";

const [current, setCurrent] = createSignal<PreviewState | null>(null);
const [minimized, setMinimized] = createSignal(false);
const [overlayVisible, setOverlayVisible] = createSignal(false);
const [overlayError, setOverlayError] = createSignal<string | null>(null);
const [progress, setProgress] = createStore<Record<string, ProgressEntry>>({});

export {
  current,
  minimized,
  overlayVisible,
  overlayError,
  progress,
  setMinimized,
};

function isMobile(): boolean {
  return window.matchMedia("(max-width: 899px)").matches;
}

function clearProgress(): void {
  for (const key of Object.keys(progress)) {
    setProgress(key, undefined as unknown as ProgressEntry);
  }
}

export function applyPreview(next: PreviewState | null): void {
  const oldUrl = current()?.url ?? "";
  const newUrl = next?.url ?? "";

  if (newUrl !== oldUrl) {
    setMinimized(isMobile());
    clearProgress();
    setOverlayVisible(false);
    setOverlayError(null);
  }
  setCurrent(next);
}

export function expand(): void {
  setMinimized(false);
}

export function minimize(): void {
  setMinimized(true);
}

export function handleLoaderMessage(data: LoaderMessage): void {
  if (data.type === "ready") {
    setOverlayVisible(false);
    setOverlayError(null);
    clearProgress();
    return;
  }
  if (data.type === "error") {
    setOverlayError(`加载失败: ${data.message ?? "unknown"}`);
    setOverlayVisible(true);
    return;
  }
  if (!data.name) return;

  if (data.type === "start") {
    if (!progress[data.name]) {
      setProgress(data.name, { loaded: 0, total: 0, done: false });
    }
    setOverlayVisible(true);
    return;
  }
  if (data.type === "progress" || data.type === "done") {
    const entry = progress[data.name] ?? { loaded: 0, total: 0, done: false };
    const next: ProgressEntry = { ...entry };
    if (typeof data.loaded === "number") next.loaded = data.loaded;
    if (typeof data.total === "number" && data.total > 0) {
      next.total = data.total;
      if (data.type === "done" && typeof data.loaded !== "number") {
        next.loaded = data.total;
      }
    }
    next.done = data.type === "done";
    setProgress(data.name, next);
  }
}

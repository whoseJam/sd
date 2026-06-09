import { For, Show, createEffect, createSignal, onMount } from "solid-js";

import type { LoaderMessage, ProgressEntry } from "../types";

import {
  current,
  expand,
  handleLoaderMessage,
  minimize,
  minimized,
  overlayError,
  overlayVisible,
  progress,
} from "../stores/preview";

function formatBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}K`;
  return `${(n / 1024 / 1024).toFixed(1)}M`;
}

function percent(entry: ProgressEntry): number {
  if (!entry.total) return 0;
  return Math.min(100, Math.round((entry.loaded / entry.total) * 100));
}

function formatProgress(entry: ProgressEntry): string {
  if (!entry.total) return entry.loaded ? formatBytes(entry.loaded) : "waiting";
  return `${percent(entry)}% · ${formatBytes(entry.loaded)}/${formatBytes(entry.total)}`;
}

function isMobile(): boolean {
  return window.matchMedia("(max-width: 899px)").matches;
}

export function Preview() {
  let panel!: HTMLDivElement;
  let iframe!: HTMLIFrameElement;
  // Lags behind current().url when transitioning to no-url so the iframe
  // content stays visible during the slide-out (240ms in CSS).
  const [iframeUrl, setIframeUrl] = createSignal("about:blank");

  const visible = () => !!current()?.url && !minimized();

  createEffect(() => {
    const url = current()?.url ?? "";
    if (url) {
      setIframeUrl(url);
    } else {
      const handle = setTimeout(() => {
        if (!current()?.url) setIframeUrl("about:blank");
      }, 240);
      return () => clearTimeout(handle);
    }
  });

  function rescale() {
    if (!iframe || !panel) return;
    if (!isMobile() || !panel.classList.contains("show")) {
      iframe.style.transform = "";
      panel.style.height = "";
      return;
    }
    const scale = panel.clientWidth / 960;
    iframe.style.transform = `scale(${scale})`;
    panel.style.height = `${720 * scale}px`;
  }

  // reveal.js layout() throws on narrow viewports — pin the iframe to a fixed
  // 960×720 internal viewport (CSS) and scale it with transform to fit.
  createEffect(() => {
    void visible();
    void iframeUrl();
    requestAnimationFrame(rescale);
  });

  onMount(() => {
    window.addEventListener("message", (event) => {
      const data = event.data as LoaderMessage | undefined;
      if (!data || data.source !== "sd-loader") return;
      handleLoaderMessage(data);
    });
    window.addEventListener("resize", () => requestAnimationFrame(rescale));
  });

  return (
    <div id="preview" ref={panel} classList={{ show: visible() }}>
      <div class="label">{current()?.label || current()?.url || ""}</div>
      <div class="toolbar">
        <button
          id="preview-minimize"
          type="button"
          aria-label="minimize"
          onClick={(e) => {
            e.stopPropagation();
            minimize();
          }}
        >
          ▾
        </button>
      </div>
      <iframe ref={iframe} src={iframeUrl()} />
      <div class="preview-overlay" classList={{ show: overlayVisible() }}>
        <div class="rows">
          <Show
            when={!overlayError()}
            fallback={
              <div class="progress-row error">
                <div class="progress-head">{overlayError()}</div>
              </div>
            }
          >
            <For each={Object.entries(progress)}>
              {([name, entry]) => (
                <div class="progress-row" classList={{ done: entry.done }}>
                  <div class="progress-head">
                    <span class="resource-name">{name}</span>
                    <span class="progress-value">{formatProgress(entry)}</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      style={{ width: `${percent(entry)}%` }}
                    />
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}

export function PreviewPill() {
  const visible = () => !!current()?.url && minimized();
  return (
    <div
      class="preview-pill"
      classList={{ show: visible() }}
      role="button"
      tabindex={0}
      onClick={expand}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          expand();
        }
      }}
    >
      <span class="icon">▤</span>
      <span class="label">{current()?.label || "preview"}</span>
      <span class="hint">tap to show ↗</span>
    </div>
  );
}

const script = document.currentScript as HTMLScriptElement | null;
const src = script?.src ?? "";
const explicitBase = script?.dataset.base?.trim();

// blob: URL means a streaming loader handed us reveal.js as a Blob; the URL
// has nothing to do with where vendor/* lives. Fall through to "." so paths
// resolve against the document.
const usable = src && !src.startsWith("blob:") ? src : "";

export const revealBase = explicitBase
  ? explicitBase
  : usable
  ? new URL(usable, location.href).href.replace(/\/[^/]+\.js(\?.*)?$/, "")
  : ".";

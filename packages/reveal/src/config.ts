const script = document.currentScript as HTMLScriptElement | null;
const src = script?.src ?? "";

export const revealBase = src
  ? new URL(src, location.href).href.replace(/\/[^/]+\.js(\?.*)?$/, "")
  : ".";

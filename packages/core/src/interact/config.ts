const script = document.currentScript as HTMLScriptElement | null;
const src = script?.src ?? "";

export const sdBase = src
  ? new URL(src, location.href).href.replace(/\/sd\.js(\?.*)?$/, "")
  : ".";

export const fontWhitelist: string[] = script?.dataset.fonts
  ?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) ?? ["Times New Roman", "Arial", "Consolas"];

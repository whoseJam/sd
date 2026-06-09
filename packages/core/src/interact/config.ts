const script = document.currentScript as HTMLScriptElement | null;
const src = script?.src ?? "";
const usable = src && !src.startsWith("blob:") ? src : "";
const explicitBase = script?.dataset.base?.trim();

export const sdBase = explicitBase
  ? explicitBase
  : usable
  ? new URL(usable, location.href).href.replace(/\/sd\.js(\?.*)?$/, "")
  : ".";

export const fontWhitelist: string[] = script?.dataset.fonts
  ?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) ?? ["Times New Roman", "Arial", "Consolas"];

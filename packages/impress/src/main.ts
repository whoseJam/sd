import { includeHTML } from "@sd/include-html";
import "@sd/element";
import "impress.js";
import "impress.js/css/impress-common.css";

import "./impress.css";

declare global {
  interface Window {
    impress: (rootId?: string) => { init: () => void };
  }
}

window.addEventListener("load", () => {
  includeHTML({ rootId: "impress" }).then(() => window.impress().init());
});

import { includeHTML } from "@whosejam/sd-include-html";
import "@whosejam/sd-element";
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

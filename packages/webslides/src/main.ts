import { includeHTML } from "@whosejam/sd-include-html";
import "@whosejam/sd-element";
import "webslides";
import "webslides/static/css/webslides.css";
import "webslides/static/css/svg-icons.css";

import "./webslides.scss";

declare global {
  interface Window {
    WebSlides: new (options?: Record<string, unknown>) => unknown;
    ws?: unknown;
  }
}

window.addEventListener("load", () => {
  includeHTML({ rootId: "webslides" }).then(() => {
    window.ws = new window.WebSlides();
  });
});

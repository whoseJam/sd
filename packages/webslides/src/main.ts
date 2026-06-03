import { includeHTML } from "@sd/include-html";
import "@sd/element";
import "webslides";
import "webslides/static/css/webslides.css";
import "webslides/static/css/svg-icons.css";

import "./webslides.scss";

declare global {
  interface Window {
    WebSlides: new (options?: Record<string, unknown>) => unknown;
  }
}

window.addEventListener("load", () => {
  includeHTML({ rootId: "webslides" }).then(() => new window.WebSlides());
});

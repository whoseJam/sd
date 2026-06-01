import type { RevealApi, RevealPlugin } from "../types";

import { CopyStyles, ReplaceElement } from "./Util";

export default function Picture(): RevealPlugin {
  return {
    id: "Picture",
    init: function init(reveal: RevealApi): void {
      const pictures = document.getElementsByTagName("picture");
      if (pictures.length === 0) return;

      const picture = pictures[0];
      const url = GetURL(picture);

      const div = document.createElement("div");
      const img = document.createElement("img");
      div.append(img);

      CopyStyles(picture, img, ["width", "height"]);
      img.setAttribute("data-source", url);

      ReplaceElement(picture, div);
      div.style.textAlign = "center";

      init(reveal);
    },
  };
}

const URL_KEYS = ["src", "data-src", "data-source"];

function GetURL(element: Element): string {
  for (const key of URL_KEYS) {
    const source = element.getAttribute(key);
    if (source) return source;
  }
  console.error(
    `Picture ${element} Seem Do Not Have a Valid URL(src, data-src or data-source)`,
  );
  return "";
}

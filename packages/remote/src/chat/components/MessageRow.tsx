import { createEffect } from "solid-js";

import type { Message } from "../types";

import { renderMarkdown } from "../services/markdown";
import { ToolChip } from "./ToolChip";

interface Props {
  message: Message & { failed?: boolean };
}

function buildImages(filenames: string[]): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = "images";
  for (const filename of filenames) {
    const img = document.createElement("img");
    img.src = "/snapshots/" + filename;
    img.loading = "lazy";
    img.alt = "";
    img.addEventListener("click", () =>
      window.open("/snapshots/" + filename, "_blank"),
    );
    wrap.appendChild(img);
  }
  return wrap;
}

export function MessageRow(props: Props) {
  if (props.message.from === "system" && props.message.kind === "tool") {
    return <ToolChip message={props.message} />;
  }

  let bubble!: HTMLDivElement;

  // Bubble is a managed DOM region: markdown for agent text needs to land as
  // direct children so markdown.css selectors (`.bubble > p`, etc.) match,
  // which JSX children + innerHTML can't combine. Effect re-runs only when
  // text/images/from change, not on every signal tick.
  createEffect(() => {
    if (!bubble) return;
    bubble.replaceChildren();
    if (props.message.text) {
      if (props.message.from === "agent") {
        bubble.innerHTML = renderMarkdown(props.message.text);
      } else {
        bubble.textContent = props.message.text;
      }
    }
    if (props.message.images && props.message.images.length > 0) {
      bubble.appendChild(buildImages(props.message.images));
    }
  });

  return (
    <div
      class={"msg " + props.message.from}
      classList={{ failed: !!props.message.failed }}
    >
      <div class="bubble" ref={bubble} />
    </div>
  );
}

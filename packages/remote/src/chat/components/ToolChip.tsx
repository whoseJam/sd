import { Show } from "solid-js";

import type { Message } from "../types";

import { Images } from "./Images";

interface Props {
  message: Message;
}

function splitToolText(text: string): { tool: string; rest: string } | null {
  const space = text.indexOf("  ");
  if (space <= 0) return null;
  return { tool: text.slice(0, space), rest: text.slice(space + 2) };
}

function stringifyRaw(raw: unknown): string {
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return String(raw);
  }
}

export function ToolChip(props: Props) {
  const parts = () =>
    props.message.text ? splitToolText(props.message.text) : null;

  return (
    <div class="tool-wrap">
      <details class="tool-chip">
        <summary>
          <span class="marker">▸</span>
          <Show when={parts()} fallback={<>{props.message.text}</>}>
            {(p) => (
              <>
                <span class="tool-name">{p().tool}</span>
                {"  "}
                {p().rest}
              </>
            )}
          </Show>
        </summary>
        <Show
          when={props.message.raw !== undefined && props.message.raw !== null}
        >
          <pre class="raw">{stringifyRaw(props.message.raw)}</pre>
        </Show>
      </details>
      <Show when={props.message.images && props.message.images.length > 0}>
        <Images images={props.message.images!} />
      </Show>
    </div>
  );
}

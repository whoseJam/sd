import { For } from "solid-js";

interface Props {
  images: string[];
}

export function Images(props: Props) {
  return (
    <div class="images">
      <For each={props.images}>
        {(filename) => (
          <img
            src={"/snapshots/" + filename}
            loading="lazy"
            alt=""
            onClick={() => window.open("/snapshots/" + filename, "_blank")}
          />
        )}
      </For>
    </div>
  );
}

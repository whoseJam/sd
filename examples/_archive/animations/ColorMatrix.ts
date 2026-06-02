import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestColorMatrix);

async function TestColorMatrix() {
  const filter = new sd.Filter({
    targetNode: svg,
    id: "filter",
    x: "-20%",
    y: "-20%",
    width: "140%",
    height: "140%",
  });
  const colorMatrix = new sd.ColorMatrix({
    targetNode: filter,
    type: "saturate",
    values: 0,
  });
  const rect = new sd.Rect({
    targetNode: svg,
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: "red",
    filter: "url(#filter)",
  });

  await sd.pause();
  colorMatrix.startAnimate().setValues(5).endAnimate();
}

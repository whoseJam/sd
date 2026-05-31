import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestDropShadow);

async function TestDropShadow() {
  const redGlow = new sd.Filter({
    targetNode: svg,
    id: "redGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
  });
  new sd.DropShadow({
    targetNode: redGlow,
    dx: 0,
    dy: 0,
    stdDeviation: 5,
    floodColor: "#ff0000",
    floodOpacity: 1,
  });

  new sd.Text({
    targetNode: svg,
    text: "你好，世界",
    fontSize: 120,
    cx: 600,
    cy: 300,
    filter: "url(#redGlow)",
  });
}

import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  new sd.Text({
    targetNode: svg,
    text: "size 20",
    centerX: 0,
    centerY: 150,
    fontSize: 20,
  });
  new sd.Text({
    targetNode: svg,
    text: "size 40",
    centerX: 0,
    centerY: 80,
    fontSize: 40,
  });
  new sd.Text({
    targetNode: svg,
    text: "size 80",
    centerX: 0,
    centerY: -50,
    fontSize: 80,
  });
}

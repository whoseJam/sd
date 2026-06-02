import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  new sd.Text({
    targetNode: svg,
    text: "abcdefg ABCDEFG 123",
    centerX: 0,
    centerY: 60,
    fontSize: 40,
    fontFamily: "Times New Roman",
  });
  new sd.Text({
    targetNode: svg,
    text: "abcdefg ABCDEFG 123",
    centerX: 0,
    centerY: -60,
    fontSize: 40,
    fontFamily: "Arial",
  });
}

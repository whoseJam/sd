import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestTransform);

async function TestMathBox() {
  const math = new sd.Math({
    targetNode: svg,
    text: "hello",
    x: 100,
    y: 100,
    fontSize: 100,
  });
  const box = new sd.Rect({
    targetNode: svg,
    x: math.getX(),
    y: math.getY(),
    width: math.getWidth(),
    height: math.getHeight(),
    fill: C.red,
    fillOpacity: 0.5,
  });
}

async function TestFontSizeBetweenTextAndMath() {
  const label = new sd.Text({
    targetNode: svg,
    text: "FontSize",
    fontSize: 50,
    fill: C.black,
    centerX: 600,
    y: 50,
  });
  const text = new sd.Text({
    targetNode: svg,
    x: 100,
    y: 300,
    fontSize: 50,
    text: "hello",
  });
  const math = new sd.Math({
    targetNode: svg,
    x: 100,
    y: 300,
    fontSize: 50,
    text: "hello",
  });
  const textBox = new sd.Rect({
    targetNode: svg,
    x: text.getX(),
    y: text.getY(),
    width: text.getWidth(),
    height: text.getHeight(),
    fill: C.red,
    fillOpacity: 0.5,
  });
  const mathBox = new sd.Rect({
    targetNode: svg,
    x: math.getX(),
    y: math.getY(),
    width: math.getWidth(),
    height: math.getHeight(),
    fill: C.blue,
    fillOpacity: 0.5,
  });
}

async function TestSubtextColor() {
  const text = new sd.Math({
    targetNode: svg,
    x: 100,
    y: 100,
    fontSize: 50,
    text: "abcabcabc",
  });
  await sd.pause();
  text.startAnimate().setSubtextFill("bc", C.red).endAnimate();
  await sd.pause();
  text.startAnimate().setSubtextFill("c", C.textBlue).endAnimate();
  await sd.pause();
  text.startAnimate().setFill(C.purple).endAnimate();
  await sd.pause();
  text.startAnimate().setFill(C.grey).endAnimate();
}

async function TestTransformWithColor() {
  const math1 = new sd.Math({
    targetNode: svg,
    text: "hello",
    x: 100,
    y: 100,
    fontSize: 50,
  });
  const math2 = new sd.Math({
    targetNode: svg,
    text: "hello",
    x: 100,
    y: 200,
    fontSize: 50,
  });
  const math3 = new sd.Math({
    targetNode: svg,
    text: "hello",
    x: 100,
    y: 300,
    fontSize: 50,
  });
  await sd.pause();
  math1.startAnimate().setFill(C.red).endAnimate();
  math2.startAnimate().setFill(C.red).setText("world").endAnimate();
  math3.startAnimate().setText("world").setFill(C.red).endAnimate();
}

async function TestTransformWithPosition() {
  const text1 = new sd.Math({
    targetNode: svg,
    x: 100,
    y: 100,
    fontSize: 50,
    text: "hello",
  });
  const text2 = new sd.Math({
    targetNode: svg,
    x: 100,
    y: 200,
    fontSize: 50,
    text: "hello",
  });
  const text3 = new sd.Math({
    targetNode: svg,
    x: 100,
    y: 300,
    fontSize: 50,
    text: "hello",
  });
  await sd.pause();
  text1.startAnimate().setX(200).endAnimate();
  text2.startAnimate().setText("world").setX(200).endAnimate();
  text3.startAnimate().setX(200).setText("world").endAnimate();
}

async function TestPosition() {
  const math = new sd.Math({
    targetNode: svg,
    text: "a",
    x: 100,
    y: 100,
  });
  await sd.pause();
  math.startAnimate().setX(200).setY(300).endAnimate();
}

async function TestTransform() {
  const math = new sd.Math({
    targetNode: svg,
    text: "a",
    x: 100,
    y: 100,
    fontSize: 100,
  });
  const box = new sd.Rect({
    targetNode: svg,
    x: math.getX(),
    y: math.getY(),
    width: math.getWidth(),
    height: math.getHeight(),
    fill: C.red,
    fillOpacity: 0.5,
  });
  await sd.pause();
  math.startAnimate({ duration: 3000 }).setText("b").endAnimate();
  box
    .startAnimate({ duration: 3000 })
    .setX(math.getX())
    .setY(math.getY())
    .setWidth(math.getWidth())
    .setHeight(math.getHeight())
    .endAnimate();
}

async function TestPythagoreanTheorem() {
  const math = new sd.Math({
    targetNode: svg,
    text: "a",
  });
  await sd.pause();
  math.startAnimate().setText("a^2").endAnimate();
}

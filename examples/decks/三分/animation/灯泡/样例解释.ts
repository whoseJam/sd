import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Vertical wall on right, lamp on top-left, person somewhere on the floor.
const wallX = 180;
const lampX = -180;
const lampY = 120;
const floorY = -80;
const personX = -40;
const personHeight = 80;

// Floor
new sd.Line({
  targetNode: svg,
  x1: -240,
  y1: floorY,
  x2: 240,
  y2: floorY,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.2,
});
// Wall
new sd.Line({
  targetNode: svg,
  x1: wallX,
  y1: floorY,
  x2: wallX,
  y2: 150,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.6,
});
// Lamp
new sd.Circle({
  targetNode: svg,
  cx: lampX,
  cy: lampY,
  r: 8,
  fill: "#fdecd9",
  stroke: C.darkOrange,
  strokeWidth: 2,
});
new sd.Text({
  targetNode: svg,
  text: "灯",
  cx: lampX,
  cy: lampY + 22,
  fontSize: 12,
  fill: C.darkOrange,
});
// Person (just a stick)
new sd.Line({
  targetNode: svg,
  x1: personX,
  y1: floorY,
  x2: personX,
  y2: floorY + personHeight,
  stroke: C.steelBlue,
  strokeWidth: 2.2,
});
new sd.Text({
  targetNode: svg,
  text: "人",
  cx: personX,
  cy: floorY + personHeight + 14,
  fontSize: 12,
  fill: C.steelBlue,
});

// Shadow on the wall: extend line from lamp through person's head to the wall.
const headX = personX;
const headY = floorY + personHeight;
const dx = headX - lampX;
const dy = headY - lampY;
const t = (wallX - lampX) / dx;
const shadowY = lampY + t * dy;

const ray1 = new sd.Line({
  targetNode: svg,
  x1: lampX,
  y1: lampY,
  x2: wallX,
  y2: shadowY,
  stroke: C.darkOrange,
  strokeWidth: 1,
  opacity: 0,
});
const ray2 = new sd.Line({
  targetNode: svg,
  x1: lampX,
  y1: lampY,
  x2: wallX,
  y2: floorY,
  stroke: C.darkOrange,
  strokeWidth: 1,
  opacity: 0,
});
const shadow = new sd.Line({
  targetNode: svg,
  x1: wallX + 3,
  y1: floorY,
  x2: wallX + 3,
  y2: shadowY,
  stroke: "#7c4dff" as sd.SDColor,
  strokeWidth: 4,
  opacity: 0,
});

const E = sd.easing();
sd.main(async () => {
  ray1
    .startAnimate({ delay: 200, duration: 320, easing: E.easeOut })
    .setOpacity(0.7)
    .endAnimate();
  ray2
    .startAnimate({ delay: 300, duration: 320, easing: E.easeOut })
    .setOpacity(0.7)
    .endAnimate();
  shadow
    .startAnimate({ delay: 500, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});

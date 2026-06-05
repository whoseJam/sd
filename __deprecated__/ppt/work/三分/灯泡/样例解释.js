import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const H = 100;
const h = 60;
const D = 200;
const people = new sd.Line(svg).source([30, H]).target([30, H - h]).arrow();
const ground = new sd.Line(svg).source([0, H]).target([D, H]);
const wall = new sd.Line(svg).source([D, H]).target([D, 0]);
const shoot = new sd.Line(svg);
const light = new sd.Circle(svg).r(10).color(C.yellow).cx(0).cy(0);
const peopleTarget = people.target();

people.drag((dx, dy) => {
    peopleTarget[0] += dx;
    updateShoot();
    return [dx, 0];
})

sd.init(() => {
    updateShoot();
})

sd.main(async () => {

})

function updateShoot() {
    shoot.source(light.center());
    const direction = V.norm(V.sub(peopleTarget, light.center()));
    const L = Math.min(H / V.sin(direction), D / V.cos(direction));
    const target = V.numberMul(direction, L);
    shoot.target(target);
}
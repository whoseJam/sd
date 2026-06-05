import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const rt = new sd.Vertex(svg, "u");
const lc = new sd.Box(svg, "lc").width(50).height(100);
const rc = new sd.Box(svg, "rc").width(50).height(100);
const lvalues = [4, 2, 6, 8];
const rvalues = [1, 5, 3, 7];
lc.childAs(new sd.Array(lc).elementWidth(15).elementHeight(15).pushArray(lvalues), R.aside("bc", 3));
rc.childAs(new sd.Array(rc).elementWidth(15).elementHeight(15).pushArray(rvalues), R.aside("bc", 3));
const l1 = new sd.Line(svg).source([0, 0]).target([300, 0]);
const l2 = new sd.Line(svg).source([0, 0]).target([300, 0]);
const brt = new sd.Box(svg, "u").width(40);
const blc = new sd.Box(svg, "lc").width(110);
const brc = new sd.Box(svg, "rc").width(110);
blc.childAs("arr", new sd.Array(lc).elementWidth(15).elementHeight(15).pushArray(lvalues), R.aside("bc", 3));
brc.childAs("arr", new sd.Array(rc).elementWidth(15).elementHeight(15).pushArray(rvalues), R.aside("bc", 3));

lc.mx(rt.cx() - 20).y(rt.my() + 50);
rc.x(rt.cx() + 20).y(rt.my() + 50);
const childGap = rc.cx() - lc.cx();

sd.init(() => {
    sd.Link(rt, lc, sd.Line, "cx", "cy", "cx", "y").arrow();
    sd.Link(rt, rc, sd.Line, "cx", "cy", "cx", "y").arrow();
    l1.x(rc.mx() + 100).y(100);
    l2.x(rc.mx() + 100).y(140);
    brt.x(l1.x() + 20).y(100);
    blc.x(brt.mx()).y(100);
    brc.x(blc.mx()).y(100);
});

sd.main(async () => {
    await sd.pause();
    const links = findPair(blc.child("arr"), brc.child("arr"));
    await sd.pause();
    links.forEach(link => link.startAnimate().fadeStoT().endAnimate().remove());
    await sd.pause();
    lc.startAnimate().dx(childGap).endAnimate();
    rc.startAnimate().dx(-childGap).endAnimate();
    blc.startAnimate().dx(brc.width()).endAnimate();
    brc.startAnimate().dx(-blc.width()).endAnimate();
    await sd.pause();
    findPair(brc.child("arr"), blc.child("arr"));
});

function findPair(arr1, arr2) {
    const links = [];
    arr1.forEachElement(e1 => {
        arr2.forEachElement(e2 => {
            if (e1.intValue() > e2.intValue()) {
                links.push(sd.Link(e1, e2, sd.Curve, "cx", "my", "cx", "my").bending(0.5).startAnimate().pointStoT().endAnimate());
            }
        });
    });
    return links;
}

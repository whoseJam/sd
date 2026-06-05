import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const arr = new sd.ValueArray(svg).start(1).elementWidth(130);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arr.push(MakeTree());
    }
    for (let i = 1; i < n; i++) {
        sd.Link(arr.element(i).child("node"), arr.element(i + 1).child("node")).value(new sd.Rect(svg).width(20).height(20).color(
            i === 1 || i === n - 1 ? C.orange : C.white)
        );
    }
})

sd.main(async () => {

})

function MakeTree() {
    const tri = new sd.Triangle(svg).width(90).height(100);

    tri.childAs("node", new sd.Vertex(tri), function(parent, child) {
        child.cx(parent.cx()).my(parent.y() - 40);
    });
    tri.childAs("line", new sd.Line(tri).value(new sd.Rect(svg).width(20).height(20)), function(parent, child) {
        child.source(parent.child("node").pos("cx", "my"));
        child.target(parent.pos("cx", "y"));
    });
    return tri;
}
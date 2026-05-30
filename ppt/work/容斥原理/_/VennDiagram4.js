import * as sd from "@/sd";

export function vennDiagram4(parent = sd.svg()) {
    const V = sd.vec();
    const arcDict = {
        0: -Math.PI / 4,
        1: (-Math.PI * 3) / 4,
        2: (+Math.PI * 3) / 4,
        3: +Math.PI / 4,
    };
    function MoveDelta(center, r, type) {
        return V.add(center, V.makeComplex(r, arcDict[type]));
    }
    function GetBoxCenter(parent) {
        const x = parent.cx();
        const y = parent.ky(0.5);
        return [x, y];
    }
    const R1 = 0.55;
    const venn = new sd.Rect(parent).width(200).height(200);
    const A = new sd.Circle(venn).fillOpacity(0);
    const B = new sd.Circle(venn).fillOpacity(0);
    const C = new sd.Circle(venn).fillOpacity(0);
    const D = new sd.Circle(venn).fillOpacity(0);
    A.childAs("label", new sd.Math(A, "A"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 0);
        child.mx(point[0]).y(point[1]);
    });
    B.childAs("label", new sd.Math(B, "B"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 1);
        child.x(point[0]).y(point[1]);
    });
    C.childAs("label", new sd.Math(C, "C"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 2);
        child.x(point[0]).my(point[1]);
    });
    D.childAs("label", new sd.Math(D, "D"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 3);
        child.mx(point[0]).my(point[0]);
    });
    venn.childAs("A", A, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 0));
    });
    venn.childAs("B", B, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 1));
    });
    venn.childAs("C", C, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 2));
    });
    venn.childAs("D", D, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 3));
    });
    venn.childAs(new sd.Math(venn, "U"), (parent, child) => {
        child.mx(parent.mx() - 5);
        child.my(parent.my() - 5);
    });
    return venn;
}

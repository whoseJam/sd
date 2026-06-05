import * as sd from "@/sd";

export function vennDiagram1(parent = sd.svg()) {
    const venn = new sd.Rect(parent).width(200).height(200);
    const A = new sd.Circle(venn);
    A.childAs("label", new sd.Math(A, "A"), (parent, child) => {
        child.cx(parent.cx());
        child.y(parent.y() + 5);
    });
    venn.childAs("A", A, (parent, child) => {
        child.r((parent.width() / 2) * 0.8);
        child.center(parent.center());
    });
    venn.childAs(new sd.Math(venn, "U"), (parent, child) => {
        child.mx(parent.mx() - 5);
        child.my(parent.my() - 5);
    });
    return venn;
}

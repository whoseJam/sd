import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const all = new sd.Array(svg);
const query = new sd.Array(svg).dy(80);
const modify = new sd.Array(svg).dy(160);
const data = ["M1", "Q1", "Q2", "Q3", "M2", "Q4", "M3", "Q5", "Q6", "M4", "M5", "Q7"];

sd.init(() => {
    all.pushArray(data);
    sd.Label(all, "所有操作");
    sd.Label(query, "查询操作");
    sd.Label(modify, "修改操作");
    for (let i = 0; i < all.length(); i++) {
        const text = data[i];
        if (text.startsWith("Q")) query.push(text);
        else modify.push(text);
    }
    for (let i = 0; i < query.length(); i++) {
        const text = query.text(i);
        let time = 0;
        for (let j = 0; j < all.length(); j++) {
            if (data[j] === text) break;
            if (data[j].startsWith("M")) time++;
        }
        const element = query.element(i);
        element.modifyTime = time - 1;
        element.childAs("child", new sd.Line(svg), (parent, child) => {
            child.source(parent.pos("cx", "my"));
            child.target(getLocation(time));
        });
    }
});

function getLocation(i) {
    if (i === modify.length()) return modify.element(i - 1).pos("mx", "y");
    return modify.element(i).pos("x", "y");
}

sd.main(async () => {
    await sd.pause();
    query
        .startAnimate()
        .sort((a, b) => {
            return sd.rand(-10, 10);
        })
        .endAnimate();
    const t = sd.Pointer(modify, "t", "t");
    const focus = sd.Focus(modify);
    for (let i = 0; i < query.length(); i++) {
        await sd.pause();
        if (i > 0) {
            query
                .element(i - 1)
                .child("child")
                .startAnimate()
                .stroke(C.black)
                .strokeWidth(1)
                .endAnimate();
        }
        query.startAnimate().color(i, C.blue).endAnimate();
        const element = query.element(i);
        t.startAnimate().moveTo(element.modifyTime).endAnimate();
        focus.startAnimate().focus(0, element.modifyTime).endAnimate();
        element.child("child").after(0).startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    }
});

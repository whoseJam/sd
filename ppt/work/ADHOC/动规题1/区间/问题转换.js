import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {
    sd.Index(arr, "t");
    arr.forEachElement(element => {
        const bl = new sd.Box(element, "(").scale(0.2);
        const tl = new sd.Text(bl, "(");
        bl.childAs(tl, (parent, child) => {
            child.cx(bl.cx()).cy(element.cy());
        });
        bl.onClick(() => {
            sd.inter(() => {
                tl.startAnimate()
                    .opacity(tl.opacity() ^ 1)
                    .endAnimate();
            });
        });
        const br = new sd.Box(element, ")").scale(0.2);
        const tr = new sd.Text(br, ")");
        br.childAs(tr, (parent, child) => {
            child.cx(br.cx()).cy(element.cy());
        });
        br.onClick(() => {
            sd.inter(() => {
                tr.startAnimate()
                    .opacity(tr.opacity() ^ 1)
                    .endAnimate();
            });
        });
        element.childAs(bl, (parent, child) => {
            child.cx(parent.kx(0.33)).y(parent.my() + 10);
        });
        element.childAs(br, (parent, child) => {
            child.cx(parent.kx(0.66)).y(parent.my() + 10);
        });
        tl.opacity(0);
        tr.opacity(0);
    });
});

sd.main(async () => {});

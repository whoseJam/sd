import * as sd from "@/sd";

const svg = sd.svg();
const code = new sd.Code(svg).y(30);
const rect = sd.Focus(code);

sd.init(() => {
    code.push("for(int i=1;i<=n;i++)");
    code.push("    for(int j=1;j<=n;j++)");
    code.push("        for(int k=1;k<=n;k++)");
    code.push("            ...              ");
});

sd.main(async () => {
    await sd.pause();
    rect.startAnimate().focus(code.element(1), code.element(4)).endAnimate();
    await sd.pause();
    sd.Label(rect, "loop(k-1)").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    code.startAnimate();
    code.forEachElement(element => {
        element.text("    " + element.text(), [[element.text(), element.text()]]);
    });
    code.insert(1, `for(int x=1;x<=n;x++)`);
    code.endAnimate();
});

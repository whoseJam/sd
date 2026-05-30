import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestTransformWithFontSize);

// async function TestSubtextColor() {
//     const text = new sd.Text(svg, "for(int i=1;i<=n;i++)ans+=i;").x(100).y(100).fontSize(40);
//     await sd.pause();
//     text.startAnimate().subtextColor("i=1", C.red).endAnimate();
// }

async function TestColorMigrate() {
    const text = new sd.Text(svg, "hello").x(100).y(100).subtextColor("ll", C.red);
    await sd.pause();
    new sd.Text(svg)
        .x(100)
        .y(200)
        .startAnimate()
        .text("aa", [[text, "ll", "aa"]])
        .endAnimate();
}

async function TestSelfReplace() {
    const text = new sd.Text(svg, "1").x(100).y(100).fontSize(50);
    await sd.pause();
    text.startAnimate(100000).text("1").endAnimate();
}

async function TestTransformFromOtherSubtext() {
    const t123 = new sd.Text(svg, "123").x(100).y(100).fontSize(50);
    const text = new sd.Text(svg).x(500).y(200).fontSize(60);
    await sd.pause();
    text.startAnimate()
        .text("1+3", [
            [t123, "1", "1"],
            [t123, "3", "3"],
        ])
        .endAnimate();
}

async function TestTransformFromOther() {
    const t1 = new sd.Text(svg, "1").x(100).y(100).fontSize(50).fill(C.textBlue);
    const t2 = new sd.Text(svg, "2").x(200).y(100).fontSize(50);
    const t3 = new sd.Text(svg, "3").x(100).y(200).fontSize(50);
    const t4 = new sd.Text(svg, "4").x(200).y(200).fontSize(50);
    const text = new sd.Text(svg).x(500).y(200).fontSize(30);
    await sd.pause();
    text.startAnimate()
        .text("1+2+3+4", [
            [t1, "1"],
            [t2, "2"],
            [t3, "3"],
            [t4, "4"],
        ])
        .subtextColor("3", C.red)
        .endAnimate();
}

async function TestTransformFromEmpty() {
    const text = new sd.Text(svg).x(100).y(100).fontSize(150);
    await sd.pause();
    text.startAnimate().text("hello").subtextColor("l", C.textBlue).endAnimate();
}

async function TestMapTransform() {
    const text = new sd.Text(svg, "HA").fontSize(150).x(100).y(100);
    await sd.pause();
    text.startAnimate()
        .text("IIa", { H: "II" })
        .fontFamily("Times New Roman")
        .subtextColorAll("Ia", C.textBlue)
        .endAnimate();
}

async function TestSpaceAndEnter() {
    const text = new sd.Text(svg).fontSize(100).text("a a a");
    const path = new sd.Path(svg).d(
        `M105 67L105 67Q105 73 103 78Q101 83 98 86Q95 89 91 91Q86 93 81 93L81 93Q76 93 72 92Q67 91 63 89L63 89L63 23L71 23L71 42L71 51Q75 46 79 44Q83 42 88 42L88 42Q92 42 95 44Q98 46 100 49Q103 52 104 57Q105 61 105 67ZM96 67L96 67Q96 63 95 60Q95 57 94 55Q92 52 91 51Q89 50 86 50L86 50Q84 50 83 50Q81 51 79 52Q77 53 76 55Q74 57 71 60L71 60L71 84Q74 85 76 85Q79 86 81 86L81 86Q84 86 87 85Q90 84 92 82Q94 80 95 76Q96 73 96 67Z`
    );
    await sd.pause();
    text.startAnimate().text(" b b ").endAnimate();
}

async function TestTextTransform() {
    const text = new sd.Text(svg).fontSize(180).text("hellg").x(100).y(100); //.fill("#ff00ff");
    await sd.pause();
    text.startAnimate().text("w").color(C.purple).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").color(C.textBlue).endAnimate();
    await sd.pause();
    text.startAnimate().text("www").fontSize(100).color(C.darkButtonGrey).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").endAnimate();
    await sd.pause();
    text.startAnimate().text("H").endAnimate().startAnimate().text("W").endAnimate();
}

async function TestConsecutiveTransform() {
    const text = new sd.Text({
        targetNode: svg,
        text: "A",
        x: 100,
        y: 100,
        fontSize: 100,
    });
    await sd.pause();
    text.startAnimate({ duration: 1000 }).setText("B").endAnimate();
    await sd.pause();
    text.startAnimate({ duration: 1000 }).setText("C").endAnimate();
}

async function TestSubtextColorWithTransform() {
    const text1 = new sd.Text(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Text(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Text(svg, "hello").x(100).y(300).fontSize(50).color(C.textBlue);
    const text4 = new sd.Text(svg, "hello").x(100).y(400).fontSize(50).subtextColor("ll", C.textBlue);
    const text5 = new sd.Text(svg, "hello").x(100).y(500).fontSize(50);
    await sd.pause();
    text1.startAnimate().text("world", { ll: "rl" }).subtextColor("rl", C.textBlue).endAnimate();
    text2
        .startAnimate()
        .text("world", [[text3, "d"]])
        .subtextColor("d", C.textBlue)
        .endAnimate();
    text4.startAnimate().text("world", { ll: "l" }).endAnimate();
    text5.startAnimate().subtextColor("ll", C.textBlue).text("world", { ll: "l" }).endAnimate();
}

async function TestTransformWithSubtextColor() {
    const text1 = new sd.Text(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Text(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Text(svg, "hello").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().text("world").endAnimate();
    text2.startAnimate().text("world").subtextColor("orl", C.red).endAnimate();
    text3.startAnimate().subtextColor("ll", C.red).endAnimate();
}

async function TestSubtextColorWithFontSize() {
    const text1 = new sd.Text(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Text(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Text(svg, "hello").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().fontSize(80).endAnimate();
    text2.startAnimate().subtextColor("ll", C.red).fontSize(80).endAnimate();
    text3.startAnimate().fontSize(80).subtextColor("ll", C.red).endAnimate();
}

async function TestSubtextColorWithPosition() {
    const text1 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 100,
        fontSize: 50,
    });
    const text2 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 200,
        fontSize: 50,
    });
    const text3 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 300,
        fontSize: 50,
    });
    await sd.pause();
    text1.startAnimate().setX(200).endAnimate();
    text2.startAnimate().setSubtextFill("ll", C.red).setX(200).endAnimate();
    text3.startAnimate().setX(200).setSubtextFill("ll", C.red).endAnimate();
}

async function TestSubtextAttribute() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 100,
        text: "abcabcabc",
    });
    await sd.pause();
    text.startAnimate(1000)
        .setSubtextFill("bca", C.red)
        .setSubtextStrokeWidth("bcab", 3)
        .setSubtextStroke("cabc", C.green)
        .endAnimate();
    await sd.pause();
    text.startAnimate().setText("hello").endAnimate();
}

async function TestTextBox() {
    const text = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 100,
        fontSize: 100,
    });
    const box = new sd.Rect({
        targetNode: svg,
        x: text.getX(),
        y: text.getY(),
        width: text.getWidth(),
        height: text.getHeight(),
        fill: C.red,
        fillOpacity: 0.5,
    });
}

async function TestTransform() {
    const text = new sd.Text({
        targetNode: svg,
        text: "a",
        x: 100,
        y: 100,
        fontSize: 100,
    });
    const box = new sd.Rect({
        targetNode: svg,
        x: text.getX(),
        y: text.getY(),
        width: text.getWidth(),
        height: text.getHeight(),
        fill: C.red,
        fillOpacity: 0.5,
    });
    await sd.pause();
    text.startAnimate().setText("a=3").endAnimate();
    box.startAnimate()
        .setX(text.getX())
        .setY(text.getY())
        .setWidth(text.getWidth())
        .setHeight(text.getHeight())
        .endAnimate();
}

async function TestSubtextColor() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 100,
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

async function TestTransformWithSpaceCharacter() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 100,
        text: "hello world",
    });
    await sd.pause();
    text.startAnimate().setText("how are you").endAnimate();
}

async function TestTransformWithFontSize() {
    const text1 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 100,
        fontSize: 50,
    });
    const text2 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 200,
        fontSize: 50,
    });
    const text3 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 300,
        fontSize: 50,
    });
    await sd.pause();
    text1.startAnimate().setFontSize(80).endAnimate();
    text2.startAnimate().setFontSize(80).setText("world").endAnimate();
    text3.startAnimate().setText("world").setFontSize(80).endAnimate();
}

async function TestTransformWithColor() {
    const text1 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 100,
        fontSize: 50,
    });
    const text2 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 200,
        fontSize: 50,
    });
    const text3 = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 300,
        fontSize: 50,
    });
    await sd.pause();
    text1.startAnimate().setFill(C.red).endAnimate();
    text2.startAnimate().setFill(C.red).setText("world").endAnimate();
    text3.startAnimate().setText("world").setFill(C.red).endAnimate();
}

async function TestTransformWithPosition() {
    const text1 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 50,
        text: "hello",
    });
    const text2 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 200,
        fontSize: 50,
        text: "hello",
    });
    const text3 = new sd.Text({
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

async function TestHugeStrokeWidth() {
    const text = new sd.Text({
        targetNode: svg,
        text: "hello",
        x: 100,
        y: 100,
        fontSize: 50,
    })
        .setFill(C.red)
        .setStroke(C.textBlue);
    await sd.pause();
    text.startAnimate().setStrokeWidth(3).endAnimate();
    await sd.pause();
    text.startAnimate().setStrokeWidth(6).endAnimate();
    await sd.pause();
    text.startAnimate().setStrokeWidth(9).endAnimate();
}

async function TestFontFamilyWithTypewritter() {
    const text1 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 60,
    });
    const text2 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 200,
        fontSize: 60,
    });
    await sd.pause();
    text1.startAnimate({ duration: 1000 }).typewritter("Arial").setFontFamily("Arial").endAnimate();
    text2.startAnimate({ duration: 1000 }).typewritter("Times New Roman").endAnimate();
}

async function TestTypewritter() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 60,
    });
    await sd.pause();
    text.startAnimate().typewritter("hello").endAnimate();
}

async function TestTypewritterWithTransform() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 60,
    });
    await sd.pause();
    text.startAnimate().typewritter("hello").setText("world").endAnimate();
}

async function TestFontFamilyWithTransform() {
    const text1 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 60,
        text: "hello",
    });
    const text2 = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 200,
        fontSize: 60,
        text: "hello",
    });
    await sd.pause();
    text1.startAnimate().setFontFamily("Arial").setText("world").endAnimate();
    text2.startAnimate().setText("world").setFontFamily("Arial").endAnimate();
}

async function TestFontFamily() {
    const text = new sd.Text({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 60,
        text: "hello",
    });
    await sd.pause();
    text.startAnimate().setFontFamily("Arial").endAnimate();
}

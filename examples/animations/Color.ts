import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestLiterialColor);

async function TestLiterialColor() {
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 40,
        fill: C.rosyBrown,
    });
    await sd.pause();
    rect.startAnimate().setFill("none").endAnimate();
    await sd.pause();
    rect.startAnimate().setFill("yellow").endAnimate();
}

async function TestColorPreset() {
    // 按照 Color 模块的分类组织颜色
    const colorCategories = [
        {
            title: "Basic Colors",
            colors: [
                { name: "red", value: C.red },
                { name: "blue", value: C.blue },
                { name: "cyan", value: C.cyan },
                { name: "grey", value: C.grey },
                { name: "pink", value: C.pink },
                { name: "snow", value: C.snow },
                { name: "azure", value: C.azure },
                { name: "black", value: C.black },
                { name: "brown", value: C.brown },
                { name: "coral", value: C.coral },
                { name: "green", value: C.green },
                { name: "white", value: C.white },
                { name: "orange", value: C.orange },
                { name: "purple", value: C.purple },
                { name: "violet", value: C.violet },
                { name: "yellow", value: C.yellow },
                { name: "indigo", value: C.indigo },
                { name: "lime", value: C.lime },
                { name: "teal", value: C.teal },
                { name: "navy", value: C.navy },
                { name: "maroon", value: C.maroon },
                { name: "olive", value: C.olive },
                { name: "silver", value: C.silver },
                { name: "gold", value: C.gold },
                { name: "beige", value: C.beige },
                { name: "ivory", value: C.ivory },
                { name: "khaki", value: C.khaki },
                { name: "lavender", value: C.lavender },
                { name: "magenta", value: C.magenta },
                { name: "mint", value: C.mint },
                { name: "peach", value: C.peach },
                { name: "plum", value: C.plum },
                { name: "salmon", value: C.salmon },
                { name: "tan", value: C.tan },
                { name: "turquoise", value: C.turquoise },
            ],
        },
        {
            title: "Dark Variants",
            colors: [
                { name: "darkRed", value: C.darkRed },
                { name: "darkBlue", value: C.darkBlue },
                { name: "darkGrey", value: C.darkGrey },
                { name: "darkPink", value: C.darkPink },
                { name: "darkGreen", value: C.darkGreen },
                { name: "darkOrange", value: C.darkOrange },
                { name: "darkPurple", value: C.darkPurple },
                { name: "darkCyan", value: C.darkCyan },
                { name: "darkGoldenrod", value: C.darkGoldenrod },
                { name: "darkKhaki", value: C.darkKhaki },
                { name: "darkMagenta", value: C.darkMagenta },
                { name: "darkOlive", value: C.darkOlive },
                { name: "darkSalmon", value: C.darkSalmon },
                { name: "darkSeaGreen", value: C.darkSeaGreen },
                { name: "darkSlateBlue", value: C.darkSlateBlue },
                { name: "darkSlateGrey", value: C.darkSlateGrey },
                { name: "darkTurquoise", value: C.darkTurquoise },
                { name: "darkViolet", value: C.darkViolet },
            ],
        },
        {
            title: "Pure Colors",
            colors: [
                { name: "pureRed", value: C.pureRed },
                { name: "pureBlue", value: C.pureBlue },
                { name: "pureGreen", value: C.pureGreen },
            ],
        },
        {
            title: "Light Variants",
            colors: [
                { name: "lightBlue", value: C.lightBlue },
                { name: "lightCoral", value: C.lightCoral },
                { name: "lightCyan", value: C.lightCyan },
                { name: "lightGreen", value: C.lightGreen },
                { name: "lightGrey", value: C.lightGrey },
                { name: "lightPink", value: C.lightPink },
                { name: "lightSalmon", value: C.lightSalmon },
                { name: "lightSeaGreen", value: C.lightSeaGreen },
                { name: "lightSkyBlue", value: C.lightSkyBlue },
                { name: "lightYellow", value: C.lightYellow },
            ],
        },
        {
            title: "Special Colors",
            colors: [
                { name: "textBlue", value: C.textBlue },
                { name: "aliceBlue", value: C.aliceBlue },
                { name: "chocolate", value: C.chocolate },
                { name: "paleGreen", value: C.paleGreen },
                { name: "peachPuff", value: C.peachPuff },
                { name: "buttonGrey", value: C.buttonGrey },
                { name: "ghostWhite", value: C.ghostWhite },
                { name: "deepSkyBlue", value: C.deepSkyBlue },
                { name: "lemonChiffon", value: C.lemonChiffon },
                { name: "darkButtonGrey", value: C.darkButtonGrey },
                { name: "crimson", value: C.crimson },
                { name: "hotPink", value: C.hotPink },
                { name: "mediumPurple", value: C.mediumPurple },
                { name: "mediumSeaGreen", value: C.mediumSeaGreen },
                { name: "mediumSlateBlue", value: C.mediumSlateBlue },
                { name: "mediumSpringGreen", value: C.mediumSpringGreen },
                { name: "mediumTurquoise", value: C.mediumTurquoise },
                { name: "mediumVioletRed", value: C.mediumVioletRed },
                { name: "midnightBlue", value: C.midnightBlue },
                { name: "mistyRose", value: C.mistyRose },
                { name: "orchid", value: C.orchid },
                { name: "paleVioletRed", value: C.paleVioletRed },
                { name: "powderBlue", value: C.powderBlue },
                { name: "rosyBrown", value: C.rosyBrown },
                { name: "royalBlue", value: C.royalBlue },
                { name: "sandyBrown", value: C.sandyBrown },
                { name: "seaGreen", value: C.seaGreen },
                { name: "skyBlue", value: C.skyBlue },
                { name: "slateBlue", value: C.slateBlue },
                { name: "slateGrey", value: C.slateGrey },
                { name: "springGreen", value: C.springGreen },
                { name: "steelBlue", value: C.steelBlue },
                { name: "tomato", value: C.tomato },
                { name: "wheat", value: C.wheat },
                { name: "yellowGreen", value: C.yellowGreen },
            ],
        },
    ];
    const rectWidth = 50;
    const rectHeight = 35;
    const padding = 3;
    const categorySpacing = 15;
    const titleHeight = 25;
    const colsPerRow = 19;
    let currentY = 10;
    let totalColors = 0;
    colorCategories.forEach(category => {
        new sd.Text({
            targetNode: svg,
            text: category.title,
            x: 10,
            y: currentY,
            fontSize: 16,
            fill: C.black,
        });
        currentY += titleHeight;
        category.colors.forEach((color, index) => {
            const row = Math.floor(index / colsPerRow);
            const col = index % colsPerRow;
            const x = col * (rectWidth + padding) + 10;
            const y = currentY + row * (rectHeight + padding);
            new sd.Rect({
                targetNode: svg,
                x,
                y,
                width: rectWidth,
                height: rectHeight,
                fill: color.value,
            });
        });
        const rows = Math.ceil(category.colors.length / colsPerRow);
        currentY += rows * (rectHeight + padding) + categorySpacing;
        totalColors += category.colors.length;
    });
}

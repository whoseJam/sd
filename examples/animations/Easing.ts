import * as sd from "@/sd";

const svg = sd.svg();
const E = sd.easing();

sd.init(() => {});

sd.main(TestInOut);

async function TestBackInOut() {
    const nodes = [];
    const easings = [E.linear, E.backIn, E.backOut, E.backInOut];
    const names = ["linear", "backIn", "backOut", "backInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

async function TestBounceInOut() {
    const nodes = [];
    const easings = [E.linear, E.bounceIn, E.bounceOut, E.bounceInOut];
    const names = ["linear", "bounceIn", "bounceOut", "bounceInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

async function TestElasticInOut() {
    const nodes = [];
    const easings = [E.linear, E.elasticIn, E.elasticOut, E.elasticInOut];
    const names = ["linear", "elasticIn", "elasticOut", "elasticInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

async function TestCubicInOut() {
    const nodes = [];
    const easings = [E.linear, E.cubicIn, E.cubicOut, E.cubicInOut];
    const names = ["linear", "cubicIn", "cubicOut", "cubicInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

async function TestQuadInOut() {
    const nodes = [];
    const easings = [E.linear, E.quadIn, E.quadOut, E.quadInOut];
    const names = ["linear", "quadIn", "quadOut", "quadInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

async function TestInOut() {
    const nodes = [];
    const easings = [E.linear, E.easeIn, E.easeOut, E.easeInOut];
    const names = ["linear", "easeIn", "easeOut", "easeInOut"];
    for (let i = 0; i < easings.length; i++) {
        const node = new sd.Circle({ targetNode: svg, cx: 200, cy: 120 + i * 120 });
        const name = new sd.Text({ targetNode: svg, text: names[i], cx: node.getCx(), cy: node.getY() - 10 });
        nodes.push(node);
        if (i > 0) new sd.Line({ targetNode: svg, x1: 100, y1: 60 + i * 120, x2: 800, y2: 60 + i * 120 });
    }
    await sd.pause();
    for (let i = 0; i < easings.length; i++) {
        nodes[i].startAnimate({ duration: 1000, easing: easings[i] }).setCx(700).endAnimate();
    }
}

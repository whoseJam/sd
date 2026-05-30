import * as sd from "@/sd";

const div = sd.div();
const svg = sd.svg();
const C = sd.color();

sd.main(TestInputChaining);

async function TestLayout() {
    const input = new sd.Input(div).x(100).y(100);
    sd.Focus(input).focus();
}

async function TestBasicInputFunctionality() {
    const input = new sd.Input(div);
    await sd.pause();
    input.x(100).y(100).width(150);
    console.assert(input.x() === 100 && input.y() === 100 && input.width() === 150, "Position setting test failed");
    await sd.pause();
    input.value("测试输入");
    console.assert(input.value() === "测试输入", "Value setting test failed");
    console.log("Basic input functionality test passed");
}

async function TestInputAnimation() {
    const input = new sd.Input(div);
    await sd.pause();
    input.startAnimate().x(200).y(200).width(150).value("动画输入框").endAnimate();
    console.log("Input animation test passed");
}

async function TestInputCallback() {
    const input = new sd.InputHTML(div);
    input.onChange(value => {
        console.log("onChange callback triggered with value:", value);
    });
}

async function TestInputChaining() {
    const input = new sd.Input(svg);
    await sd.pause();
    input
        .x(150)
        .y(150)
        .width(150)
        .value("链式调用")
        .onChange(value => console.log("Changed value:", value));
    console.assert(input.x() === 150 && input.y() === 150 && input.value() === "链式调用", "Method chaining test failed");
    console.log("Input chaining test passed");
}

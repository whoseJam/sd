import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let seq = [1, 4, 2, 5, 1, 2, 4, 1, 5];

function make_pointer(prt, name) {
    let line = sd.Line(prt)
        .x1(0).y1(30).x2(0).y2(0)
        .strokeWidth(1)
        .markerEnd("arrow");
    let label = sd.Text(line, name)
        .fontSize(20);
    line.children.push(label, () => {
        console.log("parentCX=", line.cx());
        label.cx(line.cx()).y(line.my());
    });
    return line.drag(true);
}

function make_pointered_array() {
    let array = sd.Array(svg).resize(10);
    let pointer_top = make_pointer(array, "top");
    let rule = () => {
        let posH = array.get("top");
        pointer_top.y(array.element(posH).my() + 10);
        pointer_top.x1(array.element(posH).cx());
        pointer_top.x2(array.element(posH).cx());
    }
    array.top = (x) => {
        array.set("top", x);
        rule(); };
    array.set("top", 0);
    array.children.push(pointer_top, rule);
    return array;
}

function append_array_name(array, name) {
    let text = sd.Text(array, name);
    let rule = () => {
        text.mx(array.x() - 10)
            .cy(array.cy());
    }
    array.children.push(text, rule);
    return array;
}

function append_array_index(array) {
    let index = sd.Array(array);
    let l = array.start();
    let r = l + array.length() - 1;
    for (let i = l; i <= r; i++) {
        index.push(i);
        index.element(i - l)
             .background()
             .fillOpacity(0)
             .strokeOpacity(0);
    }
    let rule = () => {
        let h = array.height() / 4;
        index.height(h)
             .width(array.width())
             .x(array.x())
             .my(array.y());
    }
    array.children.push(index, rule);
    return array;
}

let logic = sd.Array(svg).drag(true).resizeable(true).x(100).y(100);
let physic = make_pointered_array().drag(true).resizeable(true).x(100).y(200);
let top = 0;
physic.resize(10);

append_array_name(logic, "逻辑视图");
append_array_name(physic, "物理视图");
append_array_index(physic);

main();

function push(val) {
    logic.startAnimate();
    logic.push(sd.Text(logic, val));
    logic.endAnimate();
    physic.startAnimate();
    physic.value(++top, sd.Text(physic, val));
    physic.top(top);
    physic.endAnimate();
}

function pop() {
    logic.startAnimate();
    logic.pop();
    logic.endAnimate();
    top--;
    physic.startAnimate();
    physic.top(top);
    physic.endAnimate();
}

async function main() {
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        push(seq[i]);
    }
    
    await sd.pause();
    pop();
    
    await sd.pause();
    pop();

    for (let i = 4; i <= 6; i++) {
        await sd.pause();
        push(seq[i]);
    }

    await sd.pause();
    pop();

    await sd.pause();
    pop();

    await sd.pause();
    pop();

    await sd.pause();
    pop();
}
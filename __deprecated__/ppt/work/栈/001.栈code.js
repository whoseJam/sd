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
        label.cx(line.cx()).y(line.my());
    });
    return line.drag(true);
}

function make_pointered_array() {
    let array = sd.Array(svg).resize(10);
    let pointer_top = make_pointer(array, "top");
    let rule = () => {
        let posH = array.get("top");
        pointer_top.cx(array.element(posH).cx()).y(array.element(posH).my() + 10);
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

function append_code_title(code, title) {
    let text = sd.Text(code, title);
    let rule = () => {
        text.x(code.x())
            .my(code.y() - 5);
    }
    code.children.push(text, rule);
    return code;
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
let push_code = `
void push(int x){
    top++;
    s[top]=x;
}`;
let pop_code = `
void pop(int x){
    top--;
}`;
push_code = sd.Code(svg).code(push_code).drag(true).resizeable(true);
pop_code = sd.Code(svg).code(pop_code).drag(true).resizeable(true);
push_code.height(100).x(90).y(380);
pop_code.height(70).x(440).y(380);

let top = 0;
physic.resize(10);

append_array_name(logic, "逻辑视图");
append_array_name(physic, "物理视图");
append_array_index(physic);
append_code_title(push_code, "栈添加元素");
append_code_title(pop_code, "栈删除元素");

main();

async function push(val) {
    push_code.startAnimate();
    push_code.highlight(1);
    push_code.endAnimate();
    
    await sd.pause();
    push_code.startAnimate();
    push_code.highlight(2);
    push_code.endAnimate();
    
    await sd.pause();
    physic.startAnimate();
    physic.top(++top);
    physic.endAnimate();
    
    await sd.pause();
    push_code.startAnimate();
    push_code.highlight(3);
    push_code.endAnimate();

    await sd.pause();
    physic.startAnimate();
    physic.value(top, sd.Text(physic, val));
    physic.endAnimate();

    await sd.pause();
    logic.startAnimate();
    logic.push(sd.Text(logic, val));
    logic.endAnimate();

    await sd.pause();
    push_code.startAnimate();
    push_code.dehighlight();
    push_code.endAnimate();
}

async function pop() {
    pop_code.startAnimate();
    pop_code.highlight(1);
    pop_code.endAnimate();

    await sd.pause();
    pop_code.startAnimate();
    pop_code.highlight(2);
    pop_code.endAnimate();

    await sd.pause();
    physic.startAnimate();
    physic.top(--top);
    physic.endAnimate();
    
    await sd.pause();
    logic.startAnimate();
    logic.pop(0);
    logic.endAnimate();

    await sd.pause();
    pop_code.startAnimate();
    pop_code.dehighlight();
    pop_code.endAnimate();
}

async function main() {
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        await push(seq[i]);
    }
    
    await sd.pause();
    await pop();
    
    await sd.pause();
    await pop();

    for (let i = 4; i <= 6; i++) {
        await sd.pause();
        await push(seq[i]);
    }

    await sd.pause();
    await pop();

    await sd.pause();
    await pop();

    await sd.pause();
    await pop();

    await sd.pause();
    await pop();
}
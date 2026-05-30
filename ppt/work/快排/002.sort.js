import { sd } from "@/sd";

let svg = sd.svg();
let C = sd.Color;

let a = [0, 3, 4, 2, 7, 5, 3, 6, 4, 2, 4, 1, 6];
let n = a.length - 1;
let arr = null;
let code = null;
let block = null;
let lbtxt = null;
let tr = null;

let sort_code = `
int a[100005], len;
void sort(int l, int r) {
    int mid = nth_element(l, r, 一个[l,r]之间的随机数);
    sort(l, mid - 1);
    sort(mid + 1, r);
}
`;

main();

function encode(l, r) {
    return "[" + l + "," + r + "]";
}

async function main() {
    arr = sd.Array(svg)
        .x(100).y(100)
        .start_from(1)
        .drag(true)
        .resizeable(true);
    for (let i = 1; i <= n; i++) {
        arr.push(sd.Text(arr, a[i]));
    }
    block = sd.Rect(svg)
        .width(0).height(0)
        .color(C.BLUE);
    lbtxt = sd.Code(svg).code("");
    function update_label() { lbtxt.mx(block.x()).cy(block.cy()); }
    function update_block() { if (block.height() !== 0) {
        let L = code.row(block.my_l);
        let R = code.row(block.my_r);
        let min_x = code.x(), max_x = code.mx();
        let min_y = L.y(), max_y = R.my();
        block.x(min_x).width(max_x - min_x)
             .y(min_y).height(max_y - min_y);
    }; }
    code = sd.Code(svg)
        .code(sort_code)
        .drag(true)
        .resizeable(true)
        .x(700).y(200);
    tr = sd.Tree(svg).x(100).y(350)
        .width(400)
        .drag(true).resizeable(true);
    tr.vertex_template()
      .define("width", 40)
      .define("opacity", 0);
    tr.link_template()
      .define("opacity", 0);
    listen_to(block, update_label);
    listen_to(code, update_block);
    sort(1, n);
}

function color(l, r, c) {
    for (let i = l; i <= r; i++)
        arr.color(i, c);
}

function swap(l, r) {
    let tmp = a[l];
    a[l] = a[r];
    a[r] = tmp;
    let el = arr.element(l);
    let er = arr.element(r);
    let al = el.value();
    let ar = er.value();
    let h = arr.height();
    al.start_animate()
      .dy(h)
      .end_animate()
      .start_animate()
      .dx(er.cx() - el.cx())
      .end_animate()
      .start_animate()
      .dy(-h)
      .end_animate();
    ar.start_animate()
      .dy(-h)
      .end_animate()
      .start_animate()
      .dx(el.cx() - er.cx())
      .end_animate()
      .start_animate()
      .dy(h)
      .end_animate();
    arr.after(al)
       .value(r, sd.Text(arr, al.text()))
       .value(l, sd.Text(arr, ar.text()));
    al.remove();
    ar.remove();
}

async function sort(l, r, prt = "") {
    let me = encode(l, r);
    tr.start_animate()
    if (prt === "") tr.link(prt, me);
    else tr.link_opacity(prt, me, 1);
    tr.vertex_opacity(me, 1);
    tr.end_animate()
      .start_animate()
      .vertex_color(me, C.green)
    if (prt !== "") tr.vertex_color(prt, C.white);
    tr.end_animate();
    arr.start_animate();
    color(l, r, C.blue);
    arr.end_animate();
    await sd.pause();
    if (l === r) {
        color(l, r, C.white);
        return;
    }

    let t = a[l], cnt = 0;
    arr.start_animate().color(l, C.red).end_animate();
    lbtxt.code("对[" + l + "," + r + "]区间进行nth_element操作，把a[" + l + "]放在正确的位置上\n并且调整左右两边的元素")
    codeblock(3, 3);
    await sd.pause();
    for (let i = l; i <= r; i++) {
        if (a[i] < t) cnt++;
    }
    if (cnt !== 0) {
        arr.color(l, C.blue);
        arr.color(l + cnt, C.red);
        swap(l, l + cnt);
        await sd.pause();
    }
    let mid = l + cnt, pl = l, pr = r;
    while (pl < mid) {
        while (pl < mid && a[pl] < a[mid]) pl++;
        while (pr > mid && a[pr] >= a[mid]) pr--;
        if (pl === mid) break;

        arr.start_animate();
        arr.color(pl, C.orange);
        arr.color(pr, C.orange);
        arr.end_animate();
        await sd.pause();

        swap(pl, pr);
        arr.color(pl, C.blue);
        arr.color(pr, C.blue);
        await sd.pause();
    }

    arr.start_animate(); color(l, r, C.white); arr.end_animate();
    await sd.pause();

    let L = encode(l, mid - 1);
    let R = encode(mid + 1, r);
    tr.start_animate()
      .link(me, L)
      .link(me, R)
      .end_animate();

    if (l <= mid - 1) {
        lbtxt.code(`开始递归调用，对左区间${L}进行排序`);
        codeblock(4, 4);
        await sd.pause();
        await sort(l, mid - 1, me);
        tr.start_animate()
          .vertex_color(L, C.white)
          .vertex_color(me, C.green)
          .end_animate();
        await sd.pause();
    }
    
    if (mid + 1 <= r) {
        lbtxt.code(`开始递归调用，对右区间${R}进行排序`);
        codeblock(5, 5);
        await sd.pause();
        await sort(mid + 1, r, me);
        tr.start_animate()
          .vertex_color(R, C.white)
          .vertex_color(me, C.green)
          .end_animate();
        await sd.pause();
    }

    lbtxt.code("返回");
    codeblock(6, 6);
}

function codeblock(l, r) {
    let L = code.row(l);
    let R = code.row(r);
    let min_x = code.x(), max_x = code.mx();
    let min_y = L.y(), max_y = R.my();
    if (block.height() === 0) {
        block.x(min_x).width(max_x - min_x)
             .y(min_y).height(max_y - min_y)
             .opacity(0)
             .start_animate()
             .opacity(1)
             .end_animate();
    } else {
        block.start_animate()
             .x(min_x).width(max_x - min_x)
             .y(min_y).height(max_y - min_y)
             .end_animate();
    }
    block.my_l = l;
    block.my_r = r;
}

function listen_to(other, func) {
    other.listen("onX", func);
    other.listen("onY", func);
    other.listen("onWidth", func);
    other.listen("onHeight", func);
}
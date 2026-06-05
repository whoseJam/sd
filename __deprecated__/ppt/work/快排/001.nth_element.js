import { sd } from "@/sd";

let svg = sd.svg();
let C = sd.color();

let n = 13;
let k = 3;
let a = [0, 1, 1, 4, 5, 1, 4, 1, 9, 1, 9, 8, 1, 0];
let arr = null;
let code = null;
let block = null;
let lbtxt = null;
let var_cnt = null;
let var_pl = null;
let var_pr = null;
let hint = sd.Code(svg).code(`
这段代码尝试把a[${k}]这个元素放置在自己应该在的位置
随后保证这个元素左边的任意一个元素x，满足x<a[${k}]
这个元素的右边任意一个元素x，满足x>=a[${k}]
`).x(300).y(400);

let nth_element_code = `
int a[100005], len;
void nth_element(int k) {
    int cnt = 0;
    for (int i = 1; i <= len; i++)
        if (a[i] < a[k]) cnt++;
    int pos = cnt + 1;
    swap(a[pos], a[k]);
    int pl = 1, pr = len;
    while (pl < pos && pr > pos) {
        while (pl < pos && a[pl] < a[k]) pl++;
        while (pr > pos && a[pr] >= a[k]) pr--;
        swap(a[pl], a[pr]);
    }
}
`;

main();

async function main() {
    arr = sd.Array(svg)
        .x(100).y(100)
        .start_from(1)
        .drag(true);
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
    for (let i = 1; i <= n; i++)
        arr.push(sd.Text(arr, a[i]));
    code = sd.Code(svg)
        .code(nth_element_code)
        .drag(true)
        .resizeable(true)
        .x(700).y(100);
    var_cnt = sd.Text(svg, "cnt=0")
        .font_size(30).x(100).y(300)
        .drag(true).resizeable(true);
    var_pl = sd.Text(svg, "")
        .font_size(30).x(100).y(350)
        .drag(true).resizeable(true);
    var_pr = sd.Text(svg, "")
        .font_size(30).x(100).y(400)
        .drag(true).resizeable(true);
    listen_to(block, update_label);
    listen_to(code, update_block);
    nth_element(k);
}

async function nth_element(k) {
    let t = a[k];
    let cnt = 0;
    lbtxt.code("统计比a[" + k + "]小的数字的个数\n记作cnt");
    codeblock(3, 5);
    arr.color(k, C.red);
    await sd.pause();

    let lst = 0;
    for (let i = 1; i <= n; i++) {
        if (a[i] < t) {
            cnt++;
            let e = arr.element(i);
            let txt = sd.Text(svg, a[i])
                .cx(e.cx()).cy(e.cy())
                .font_size(20);
            e.after(lst)
             .start_animate()
             .color(C.blue)
             .end_animate()
             .start_animate()
             .color(C.white)
             .end_animate();
            txt.opacity(0)
               .after(lst)
               .opacity(1)
               .start_animate()
               .cx(var_cnt.cx()).my(var_cnt.y())
               .end_animate()
               .remove();
            var_cnt.after(txt)
                   .text("cnt=" + cnt);
            lst = txt;
        }
    }
    await sd.pause();

    if (cnt !== 0) {
        arr.start_animate()
        arr.color(k, C.red);
        arr.color(1 + cnt, C.red);
        arr.end_animate();
        lbtxt.code("由于比a[" + k +"]小的数字总共有" + cnt + "个\n所以a[" + k + "]实际应该在下标为" + (cnt+1) + "的位置上\n交换a[" + k + "]与a[" + (1+cnt) + "]");
        codeblock(6, 7);
        await sd.pause();
        swap(k, 1 + cnt);
        arr.start_animate()
           .color(k, C.white)
           .color(1 + cnt, C.grey)
           .end_animate();
        await sd.pause();
    }

    lbtxt.code("把左边不小于" + t + "的数字放在右边\n把右边小于" + t + "的数字放在左边")
    codeblock(8, 13);
    await sd.pause();

    let mid = 1 + cnt;
    let pl = 1, pr = n;
    arr.start_animate()
       .color(pl, C.green)
       .color(pr, C.green)
       .end_animate();
    var_pl.text("pl=" + pl);
    var_pr.text("pr=" + pr);
    await sd.pause();

    while (pl < mid) {
        lbtxt.code("移动pl直到找到一个不小于" + t + "的数字");
        codeblock(10, 10);
        await sd.pause();

        while (pl < mid && a[pl] < a[mid]) {
            arr.start_animate().color(pl, C.white);
            if (pl + 1 < mid) arr.color(pl + 1, C.green);
            arr.end_animate();
            pl++;
            var_pl.text("pl=" + pl);
            await sd.pause();
        }

        lbtxt.code("移动pr直到找到一个比" + t + "小的数字");
        codeblock(11, 11);
        await sd.pause();
        while (pr > mid && a[pr] >= a[mid]) {
            arr.start_animate().color(pr, C.white);
            if (pr - 1 > mid) arr.color(pr - 1, C.green);
            arr.end_animate();
            pr--;
            var_pr.text("pr=" + pr);
            await sd.pause();
        }
        if (pl === mid) break;

        lbtxt.code("交换a[" + pl + "]和a[" + pr + "]");
        codeblock(12, 12);
        await sd.pause();
        arr.start_animate();
        arr.color(pl, C.orange);
        arr.color(pr, C.orange);
        arr.end_animate();
        await sd.pause();

        swap(pl, pr);
        arr.color(pl, C.green);
        arr.color(pr, C.green);
        await sd.pause();
    }
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

function listen_to(other, func) {
    other.listen("onX", func);
    other.listen("onY", func);
    other.listen("onWidth", func);
    other.listen("onHeight", func);
}
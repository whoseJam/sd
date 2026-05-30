import { sd } from "@/sd";

let a = [0, 1, 6, 2, 5, 9, 6, 5, 4, 3];
let n = a.length - 1;

let svg = sd.svg();
let C = sd.color();
let tr = null;
let arr = null;

main();

async function main() {
    tr = sd.Tree(svg)
        .drag(true).resizeable(true)
        .x(700).y(100)
        .width(500);
    tr.vertex_template()
      .define("radius", 20);
    prebuild(1, n);
    tr.vertex_opacity(0)
      .link_opacity(0);
    arr = sd.Array(svg)
        .drag(true).resizeable(true)
        .x(100).y(100)
        .start_from(1)
        .hsj_push_array(a, 1, n);
    await mergesort(1, n);
}


function encode(l, r) {
    return "[" + l + "," + r + "]";
}

function prebuild(l, r, prt = "") {
    let me = encode(l, r);
    tr.link(prt, me);
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    prebuild(l, mid, me);
    prebuild(mid + 1, r, me);
}

async function mergesort(l, r, prt = "") {
    let mid = Math.floor((l + r) / 2);
    let me = encode(l, r);

    tr.start_animate();
    if (prt) tr.link_opacity(prt, me, 1);
    tr.vertex_opacity(me, 1);
    tr.end_animate();
    if (l === r) return;

    await mergesort(l, mid, me);
    await mergesort(mid + 1, r, me);

    let L = encode(l, mid);
    let R = encode(mid + 1, r);
    tr.start_animate()
      .vertex_color(me, C.RED)
      .vertex_color(L, C.GREEN)
      .vertex_color(R, C.BLUE)
      .end_animate();
    arr.after(tr).start_animate();
    color(arr, l, mid, C.green);
    color(arr, mid + 1, r, C.blue);
    arr.end_animate();
    await sd.pause();

    await merge(l, r, mid);
    tr.start_animate()
      .vertex_color(me, C.DEFAULT)
      .vertex_color(L, C.DEFAULT)
      .vertex_color(R, C.DEFAULT)
      .end_animate();
    arr.after(tr).start_animate();
    color(arr, l, mid, C.white);
    color(arr, mid + 1, r, C.white);
    arr.end_animate();
}

function color(a, l, r, c) {
    for (let i = l; i <= r; i++)
        a.color(i, c);
}

async function merge(l, r, mid) {
    let a1 = sd.Array(svg).x(200).y(200).start_from(1);
    let a2 = sd.Array(svg).x(200).y(300).start_from(1);
    let a3 = sd.Array(svg).x(200).y(400).start_from(1);
    a1.start_animate();
    for (let i = l; i <= mid; i++)
        a1.push(a[i]);
    a1.end_animate();
    a2.start_animate()
    for (let i = mid + 1; i <= r; i++)
        a2.push(a[i]);
    a2.end_animate();
    await sd.pause();

    let stamp = 0;
    while (a1.length() > 0 && a2.length() > 0) {
        let f1 = +a1.element(1).value().text();
        let f2 = +a2.element(1).value().text();
        if (f1 < f2) {
            a1.after(stamp)
              .start_animate()
              .erase(1)
              .end_animate();
            stamp = a1;
        } else {
            a2.after(stamp)
              .start_animate()
              .erase(1)
              .end_animate();
            stamp = a2;
        }
        a3.after(stamp)
          .start_animate()
          .push(Math.min(f1, f2))
          .end_animate();
        stamp = a3;
    }
    while (a1.length() > 0) {
        let f1 = +a1.element(1).value().text();
        a1.after(stamp)
          .start_animate()
          .erase(1)
          .end_animate();
        stamp = a1;
        a3.after(stamp)
          .start_animate()
          .push(f1)
          .end_animate();
        stamp = a3;
    }
    while (a2.length() > 0) {
        let f2 = +a2.element(1).value().text();
        a2.after(stamp)
          .start_animate()
          .erase(1)
          .end_animate();
        stamp = a2;
        a3.after(stamp)
          .start_animate()
          .push(f2)
          .end_animate();
        stamp = a3;
    }
    await sd.pause();
    stamp = 0;
    for (let i = 1; i <= a3.length(); i++) {
        let E = arr.element(l + i - 1);
        let e = a3.element(i);
        let v = e.value();
        let txt = sd.Text(svg, v.text())
            .cx(e.cx()).cy(e.cy()).opacity(0);
        txt.after(stamp)
           .opacity(1)
           .start_animate()
           .cx(E.cx()).cy(E.cy())
           .end_animate();
        E.after(txt).value(txt);
        a[l + i - 1] = +v.text();
    }
    a1.after(stamp).remove();
    a2.after(stamp).remove();
    a3.after(stamp).remove();
    await sd.pause();
}
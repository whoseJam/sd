import { SVG } from '@svgdotjs/svg.js';
import { Array } from "#lib/array.js";
import { Tree } from '#lib/tree.js';
import { Message } from "#lib/message.js";
import { pause } from '#lib/utility';

let draw = SVG().addTo("body").size(1200, 600);
let tr = new Tree(draw);
tr.link("1", "2", "e1");
tr.link("2", "3", "e4");
tr.link("3", "4", "e8");
tr.link("3", "5", "e9");
tr.link("2", "6", "e5");
tr.link("1", "7", "e2");
tr.link("7", "8", "e6");
tr.link("7", "9", "e7");
tr.link("1", "10", "e3");
tr.plot("1");
tr.cx(300);
tr.y(40);

let arr = new Array(draw);
arr.x(20);
arr.y(500);
arr.plot();

const dfs = (cur, parent = null) => {
    pause(() => { arr.append(new Message(draw, cur.value().message()), true); });
    cur.to.forEach((child) => {
        if (child != parent) {
            pause(() => { arr.append(tr.edge(cur, child).value().message(), true); });
            dfs(child, cur);
            pause(() => { arr.append(tr.edge(cur, child).value().message(), true); });
        }
    })
}

dfs(tr.root());
let arr_bef = arr;
let arr_mid;
let arr_aft;
pause(() => { arr_mid = arr.split(2, 13, 1, true); console.log(arr_mid); });
pause(() => { arr_mid.dx(-arr_mid.element_width() * 2, true); });
pause(() => { arr_aft = arr.split(2, 13, -1, true); });
pause(() => { arr_aft.dx(-arr_aft.element_width() * 15, true); });
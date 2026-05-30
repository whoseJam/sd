import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let varTable1 = sd.VarTable(svg).drag(true).resizeable(true);
varTable1.put("a", 1);
varTable1.put("b", 1);
varTable1.put("c", "未知");
let varTable2 = sd.VarTable(svg).drag(true).resizeable(true);
varTable2.put("sum", 10);
varTable2.put("ans", 20);
varTable2.put("rank", "未知");
let arrow = sd.Arrow(svg).from(varTable1).to(varTable2);

main();

async function main() {
    await sd.pause();
    varTable.startAnimate();
    varTable.pushPrimary("a", "1");
    varTable.endAnimate();

    await sd.pause();
    varTable.pushPrimary("b", "未知");
    await sd.pause();
    varTable.pushPrimary("c", "未知");
}

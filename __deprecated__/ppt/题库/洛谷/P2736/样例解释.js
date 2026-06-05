import * as sd from "@/sd";

// 输入数据
const songCount = 5; // 歌曲数量N
const cdCapacity = 50; // CD容量T
const cdCount = 3; // CD数量M
const songLengths = [20, 30, 15, 25, 10]; // 歌曲长度数组

// 创建svg容器
const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

// 创建CD数组
const cds = [];

// 创建歌曲序列数组
const songArray = new sd.Array(svg).x(100).y(300);
const cdArray = new sd.ValueArray(svg).elementWidth(150);
// 初始化歌曲数据
for (let i = 0; i < songCount; i++) {
    songArray.push(songLengths[i]);
}
sd.Label(songArray, "歌曲数组", "lc");

// 为每个歌曲添加点击事件
songArray.forEachElement((rect, i) => {
    rect.onClick(() => {
        sd.inter(async () => {
            if (rect.fill() === C.grey) rect.startAnimate().fill(C.white).endAnimate();
            else rect.startAnimate().fill(C.grey).endAnimate();
            updateCD();
        });
    });
});

function updateCD() {
    songArray.forEachElement(song => {
        song.placed = false;
    });
    for (let j = 0; j < cdCount; j++) {
        const cd = cdArray.element(j);
        // 重新计算CD容量
        cd.usedCapacity = 0;
        cd.remainingCapacity = cdCapacity;
        // 更新歌曲占用部分
        const sections = [];
        let cumulated = 0;
        // 重新开始塞歌
        for (let k = 0; k < songCount; k++) {
            if (songArray.element(k).placed) continue;
            if (songArray.element(k).fill() !== C.grey) continue;
            const song = songLengths[k];
            if (cd.remainingCapacity >= song) {
                cd.usedCapacity += song;
                cd.remainingCapacity -= song;
                songArray.element(k).placed = true;
                if (cd.sections.length > 0) {
                    const section = cd.sections.shift();
                    sections.push(section);
                    section
                        .startAnimate()
                        .x(cd.x() + 2 + cumulated)
                        .y(cd.y() + 2)
                        .width((song * 96) / cdCapacity)
                        .height(46)
                        .endAnimate();
                } else {
                    const section = new sd.Rect(svg)
                        .x(cd.x() + 2 + cumulated)
                        .y(cd.y() + 2)
                        .width((song * 96) / cdCapacity)
                        .height(46)
                        .opacity(0)
                        .startAnimate()
                        .opacity(1)
                        .endAnimate();
                    sections.push(section);
                }
                cumulated += (song / cdCapacity) * 100;
            } else break;
        }
        for (const section of cd.sections) section.startAnimate().opacity(0).endAnimate().remove();
        cd.sections = sections;
        // 更新CD信息文本
        cd.child("label").text(`${cd.usedCapacity}/${cd.remainingCapacity + cd.usedCapacity}`);
    }
    let allocatedCount = 0;
    songArray.forEachElement(song => {
        if (song.fill() === C.grey) allocatedCount++;
    });
    statusText.text(`已选歌曲数: ${allocatedCount}   总歌曲数: ${songCount}`);
}

// 创建CD对象及相关显示元素
for (let i = 0; i < cdCount; i++) {
    const cd = new sd.Rect(cdArray).width(102).height(50);
    cd.usedCapacity = 0;
    cd.remainingCapacity = cdCapacity;
    cd.sections = [];
    cd.childAs("label", new sd.Text(svg, `0/${cdCapacity}`), R.aside("tc"));
    cdArray.push(cd);
}

// 显示当前状态文本
const statusText = new sd.Text(svg, `已选歌曲数: ${0}   总歌曲数: ${songCount}`).cx(100).y(50);

// 初始化函数
sd.init(() => {
    cdArray.cx(songArray.cx()).my(songArray.y() - 40);
    statusText.cx(cdArray.cx()).my(cdArray.y() - 60);
});

// 主函数
sd.main(async () => {});

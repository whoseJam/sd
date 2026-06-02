import * as sd from "@/sd";

const svg = sd.svg();
const domain = "http://localhost:1313";

sd.init(() => {});

sd.main(TestBasic);

async function TestScale() {
  const tree = new sd.Tree(svg);
  tree.link(1, 2, new sd.Image(svg).href(domain + "/img/gift.png").scale(0.5));
  tree
    .newNode(3)
    .newLink(1, 3, new sd.Image(svg).href(domain + "/img/snowflake.png"));
}

async function TestBasic() {
  const img1 = new sd.Image(svg).href(domain + "/img/gift.png");
  const img2 = new sd.Image(svg).href(domain + "/img/gift.png").x(50);
  await sd.pause();
  img1.href(domain + "/img/snowflake.png");
  img2
    .startAnimate()
    .href(domain + "/img/snowflake.png")
    .endAnimate();
}

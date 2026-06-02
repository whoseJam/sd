import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg);

sd.init((args) => {
  console.log("args=", args);
  if (args.array) bar.pushArray(args.array);
  else bar.pushArray([1, 2, 3, 4]);
});

sd.main(async () => {});

/*
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="./sd-element.js"></script>
    </head>
    <body>
        <h1>&lt;sd-animation&gt; test</h1>
        <div style="width: 500px; height: 400px; background-color: lightcyan">
            <sd-animation id="anim"
                src="./iframeWrapper.html"
                viewbox="-0.40000000000000036 -160.4 160.8 161.4"
                style="width: 100%; height: 100%">
            </sd-animation>
        </div>
        <input type="text" id="input" value="1 2 1 2" />
        <button onclick="submit()">提交</button>
    </body>
    <script>
        function submit() {
            const input = document.getElementById("input");
            const values = input.value.split(" ").map((v) => +v);
            const anim = document.getElementById("anim");
            anim.setAttribute("args", JSON.stringify({ array: values }));
            anim.reload();
        }
    </script>
</html>
*/

import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg);

sd.init(args => {
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
        <script src="./iframe.js"></script>
    </head>
    <body>
        <h1>IFrame Test</h1>
        <div style="width: 500px; height: 400px; background-color: lightcyan">
            <iframe data-animation="./iframeWrapper.html"
                data-viewBox="-0.40000000000000036 -160.4 160.8 161.4"
                id="iframe" style="width: 100%; height: 100%">
            </iframe>
        </div>
        <input type="text" id="input" value="1 2 1 2" />
        <button onclick="submit()">提交</button>
    </body>
    <script>
        const animation = document.getElementById("iframe");
        animation.onsubmit = data;
        function data() {
            const input = document.getElementById("input");
            const values = input.value.split(" ").map((value) => +value);
            return { array: values };
        }
        function submit() {
            iframe.update(animation);
        }
        iframe.init(document);
    </script>
</html>
*/
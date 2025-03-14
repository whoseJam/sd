const plugins = [];

import Reveal from "reveal.js";
import Image from "./plugin/Image";
import Picture from "./plugin/Picture";
import Problem from "./plugin/Problem";
import MathJax2 from "./plugin/MathJax2";
import Codeblock from "./plugin/Codeblock";
import SDAnimation from "./plugin/SDAnimation";
import Highlight from "./plugin/HighlightEngine";
import "./plugin/Chalkboard";

plugins.push(Image);
plugins.push(Picture);
plugins.push(Problem);
plugins.push(MathJax2);
plugins.push(Codeblock);
plugins.push(SDAnimation);
plugins.push(Highlight);
plugins.push(window.RevealChalkboard);
window.Reveal = Reveal;

window.MyRevealCallback = function() {
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        chalkboard: {
            boardmarkerWidth: 5,
            chalkEffect: 0,
            storage: null,
            src: null,
            readOnly: undefined,
            transition: 800,
            theme: "whiteboard",
            eraser: { src: "https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/sponge.png", radius: 20 },
            boardmarkers : [
                { color: "rgba(100,100,100,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-black.png), auto" },
                { color: "rgba(30,144,255, 1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-blue.png), auto" },
                { color: "rgba(220,20,60,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-red.png), auto" },
                { color: "rgba(50,205,50,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-green.png), auto" },
                { color: "rgba(255,140,0,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-orange.png), auto" },
                { color: "rgba(150,0,20150,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-purple.png), auto" },
                { color: "rgba(255,220,0,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-yellow.png), auto" }
            ]
        },
        plugins: plugins
    });
}

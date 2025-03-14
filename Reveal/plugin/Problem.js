import { ReplaceElement } from "./Util";

export default function Problem() {
    return { 
        id: "Problem",
        init: function init(reveal) {
            const problems = document.getElementsByTagName("problem");
            if (problems.length === 0) return;

            const problem = problems[0];
            const parent = problem.parentNode;
            const url = getURL(problem);

            const sec = document.createElement("section");
            sec.setAttribute("data-background-iframe", url);
            sec.setAttribute("data-background-interactive", "");

            ReplaceElement(problem, sec);

            init(reveal);
        }
    };
}

const URL_KEYS = [
    "src",
    "data-src",
    "data-source"
];

function getURL(element) {
    for (let key of URL_KEYS) {
        const source = element.getAttribute(key);
        if (source) return source;
    }
    const problemset = element.getAttribute("data-problemset");
    const problemid = element.getAttribute("data-problemid");
    if (problemid && problemset) return `https://whosejam.site/#/problem/${problemset}/${problemid}`;
    console.error(`Problem ${element} Seem Do Not Have a Valid URL`);
    return "";
}
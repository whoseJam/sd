
// ./xxxx/yyyy.html
function getLocation(path) {
    path = path.replace("\\", "/");
    const folders = path.split("/").slice(0, -1);
    return folders.join("/");
}

export function getLocationFromAncestor(element) {
    while (element.parentNode && element.parentNode.getAttribute) {
        const parent = element.parentNode;
        if (parent.id === "slide-host") return undefined;
        if (parent.getAttribute("location"))
            return parent.getAttribute("location");
        element = parent;
    }
    return undefined;
}

function loadFromURL(element, url, allowSecondTry = true) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
            const parser = new DOMParser();
            const htmlString = this.responseText;
            const doc = parser.parseFromString(htmlString, "text/html");
            const body = doc.documentElement.children[1];
            const parent = element.parentNode;
            if (!parent) {
                return;
            }
            while (body.children.length > 0) {
                const child = body.children[body.children.length - 1];
                child.setAttribute("location", getLocation(url));
                parent.insertBefore(child, element.nextSibling);
            }
            parent.removeChild(element);
            findIncludeHTMLRequest();
            return;
        } else if (allowSecondTry) {
            const location = getLocationFromAncestor(element);
            if (location) {
                loadFromURL(element, `${location}/${url}`, false);
                return; 
            }
        }
        console.warn(`File ${url} Not Found`);
        const parent = element.parentNode;
        parent.removeChild(element);
        findIncludeHTMLRequest();
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function findIncludeHTMLRequest() {
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const file = element.getAttribute("include-html") ? element.getAttribute("include-html") : element.getAttribute("w3-include-html");
        if (!file) continue;
        loadFromURL(element, file);
        return;
    }
    if (global.callback) {
        global.callback();
        delete global["callback"];
    }
}

export default function includeHTML(callback) {
    global.callback = callback;
    findIncludeHTMLRequest();
}
import { CopyStyles } from "./Util";
import { ReplaceElement } from "./Util";

export default function Picture() {
    return {
        id: "Picture",
        init: function init(reveal) {
            const pictures = document.getElementsByTagName("picture");
            if (pictures.length === 0) return;

            const picture = pictures[0];
            const parent = picture.parentNode;
            const url = GetURL(picture);

            // build structure
            const div = document.createElement("div");
            const img = document.createElement("img");
            div.append(img);
            
            // build attribute of img
            CopyStyles(picture, img, ["width", "height"]);
            img.setAttribute("data-source", url);
            
            // build attribute of div
            ReplaceElement(picture, div);
            div.style["textAlign"] = "center";
            
            init(reveal);
        }
    };
}

const URL_KEYS = [
    "src",
    "data-src",
    "data-source"
];

function GetURL(element) {
    for (let key of URL_KEYS) {
        const source = element.getAttribute(key);
        if (source) return source;
    }
    console.error(`Picture ${element} Seem Do Not Have a Valid URL(src, data-src or data-source)`);
    return "";
}
import { getLocationFromAncestor } from "../Inject";

export default function Image() {
    return { id: "image", init };
}

function init(reveal) {
    reveal.addEventListener("slidechanged", event => {
        const currentSlide = event.currentSlide;
        const images = currentSlide.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            image.setAttribute("src", getURL(image));
        }
        // TODO 检测到所有 image 都加载完成后，再进行 reveal.layout
        if (images.length >= 1) {
            setTimeout(() => reveal.layout(), 50);
        }
    })
}

function getURL(image) {
    let url = image.getAttribute("data-source");
    if (!url) return undefined;
    if (url.startsWith("./image") || url.startsWith("http") || url.startsWith("image")) return url;
    return getLocationFromAncestor(image) + "/" + url;
}
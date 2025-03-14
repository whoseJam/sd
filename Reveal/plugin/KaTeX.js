export const KaTeX = () => {
	let deck;

	const defaultOptions = {
		version: "latest",
		delimiters: [
			{ left: "$$" , right: "$$" , display: true  },
			{ left: "$"  , right: "$"  , display: false },
			{ left: "\\(", right: "\\)", display: false },
			{ left: "\\[", right: "\\]", display: true  }
		],
		ignoredTags: ["script", "noscript", "style", "textarea", "pre"]
	}

	const loadCss = src => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = src;
		document.head.appendChild(link);
	};

	const loadScript = src => {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.onload = resolve;
			script.onerror = reject;
			script.src = src;
			document.head.append(script);
		});
	};

	async function loadScripts(urls) {
		for(const url of urls) {
			await loadScript(url);
		}
	}

	return {
		id: "katex",

		init: function (reveal) {

			deck = reveal;

			const revealOptions = deck.getConfig().katex || {};

			const options = {...defaultOptions, ...revealOptions};
			const {local, version, extensions, ...katexOptions} = options;

			const baseUrl = options.local || "https://cdn.jsdelivr.net/npm/katex";
			const versionString = options.local ? "" : "@" + options.version;

			const cssUrl    = baseUrl + versionString + "/dist/katex.min.css";
			const katexUrl  = baseUrl + versionString + "/dist/katex.min.js";
			const mhchemUrl = baseUrl + versionString + "/dist/contrib/mhchem.min.js"
			const karUrl    = baseUrl + versionString + "/dist/contrib/auto-render.min.js";

			const katexScripts = [katexUrl];
			if(options.extensions && options.extensions.includes("mhchem")) {
				katexScripts.push(mhchemUrl);
			}
			katexScripts.push(karUrl);

			const renderMath = () => {
				renderMathInElement(reveal.getSlidesElement(), katexOptions);
				const elements = document.querySelectorAll(".math-fragment .katex-html");
				elements.forEach(math => renderMathFragment(math));
				deck.layout();
			}

			loadCss(cssUrl);

			loadScripts(katexScripts).then(() => {
				if (deck.isReady()) {
					renderMath();
				}
				else {
					deck.on("ready", renderMath.bind(this));
				}
			});
		}
	}
};

function renderMathFragment(math) {
	const children = [...math.children];
	if (children.length >= 2) {
		for (let l = 0, r; l < children.length; l = r + 1) {
			const container = document.createElement("div");
			if (l > 0) {
				container.setAttribute("class", "fragment");
			}
			r = l;
			while (r + 1 < children.length && !children[r + 1].classList.contains("newline")) {
				r++;
			}
			for (let i = l; i <= r; i++) {
				container.appendChild(children[i]);
			}
			math.appendChild(container);
		}
	} else if (children.length === 1) {
		const parent = math.querySelectorAll(".mord > .mtable > .col-align-l > .vlist-t > .vlist-r > .vlist")[0];
		if (parent) {
			for (let i = 1; i < parent.children.length; i++) {
				parent.children[i].setAttribute("class", "fragment");
			}
		}
	}
}
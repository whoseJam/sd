
const DEFAULT_OPTIONS = {
	messageStyle: "none",
	tex2jax: {
		inlineMath: [["$", "$"], ["\\(", "\\)"]],
		skipTags: ["script", "noscript", "style", "textarea", "pre"]
	},
	skipStartupTypeset: true
};

// "TeX-AMS_SVG"  : Chinese Character Display Error
// "TeX-AMS_HTML" : Full Tested
// "TeX-AMS_CHTML": Not Support Yet  
const DEFAULT_CONFIG = "TeX-AMS_CHTML";

function LoadScript(url, callback) {
	const head = document.querySelector("head");
	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;

	script.onload = function() {
		if (typeof(callback) === "function") {
			callback.call();
			callback = null;
		}
	};

	head.appendChild(script);
}

export default function MathJax2() {
	return {
		id: "MathJax2",
		init: async function(reveal) {
			const revealOptions = reveal.getConfig().mathjax2 || reveal.getConfig().math || {};
			const options = { ...DEFAULT_OPTIONS, ...revealOptions };
			const script = options.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js";
			const config = options.config || DEFAULT_CONFIG;
			const url = script + "?config=" + config;
			
			options.tex2jax = { ...DEFAULT_OPTIONS.tex2jax, ...revealOptions.tex2jax };
			options.mathjax = options.config = null;

			const promise = new Promise(resolve => {
				LoadScript(url, function() {
					MathJax.Hub.Config(options);

					MathJax.Hub.Queue(["Typeset", MathJax.Hub, reveal.getRevealElement()]);
					MathJax.Hub.Queue(() => RenderMathFragment(config));
					if (config === "TeX-AMS_CHTML") 
						MathJax.Hub.Queue(() => MaintainFontSize());
					MathJax.Hub.Queue(() => reveal.layout());
					MathJax.Hub.Queue(() => resolve(0));
				})
			});

			return promise;
		}
	}
}

function RenderMathFragment(config) {
	const math = document.querySelectorAll(".math-fragment");
	math.forEach(element => Renderer[config](element));
}

function MaintainFontSize() {
	const math = document.querySelectorAll(".mjx-chtml.MathJax_CHTML");
	math.forEach(element => element.style["fontSize"] = "120%");
}

const Renderer = {
	"TeX-AMS_SVG": function(math) {
		const svg = math.querySelector(".MathJax_SVG").children[0];
		const a = svg.children[0]; if (!a) return;
		const b = a.children[0]; if (!b) return;
		const c = b.children[1]; if (!c) return;
		AttachFragment(c);
	},
	"TeX-AMS_CHTML": function(math) {
		const span = math.querySelector(".mjx-chtml.MJXc-display"); if (!span) return;
		const table = span.querySelector(".mjx-table"); if (!table) return;
		AttachFragment(table);
	},
	"TeX-AMS_HTML": function(math) {
		const span = math.querySelector(".math");
		const a = span.children[0]; if (!a) return;
		const b = a.children[0]; if (!b) return;
		const c = b.children[0]; if (!c) return;
		const d = c.children[0]; if (!d) return;
		const e = d.children[0]; if (!e) return;
		const f = e.children[1]; if (!f) return;
		const g = f.children[0]; if (!g) return;
		AttachFragment(g);
		// const h = e.children[0]; if (!h) return;
		// const i = h.children[0]; if (!i) return;
		// AttachFragment(i);
	}
}

function AttachFragment(rows) {
	for (let i = 1; i < rows.children.length; i++) {
		rows.children[i].classList.add("fragment");
	}
}
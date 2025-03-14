import includeHTML from "../Reveal/Inject";
import "../Reveal/plugin/Chalkboard.css";
import "../Reveal/plugin/reset.css";
import "../Reveal/plugin/reveal.css";

class ThemeManager {
    static AVAILABLE_THEMES = ["beige", "dracula", "serif", "simple", "sky", "solarized", "white"];
    constructor() {
        this.themeSelector = null;
        this.initializeThemeSelector();
        this.setupEventListeners();
    }
    initializeThemeSelector() {
        this.themeSelector = this.createThemeSelectorElement();
        document.body.appendChild(this.themeSelector);
    }
    createThemeSelectorElement() {
        const selector = document.createElement("div");
        selector.id = "theme-selector";
        selector.style.cssText = this.getThemeSelectorStyles();
        const select = this.createThemeDropdown();
        selector.appendChild(select);
        return selector;
    }
    getThemeSelectorStyles() {
        return `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            padding: 15px;
            border-radius: 12px;
            z-index: 1000;
            display: none;
            transition: all 0.3s ease;
            width: 200px;
            max-width: 90vw;
        `;
    }
    createThemeDropdown() {
        const select = document.createElement("select");
        select.style.cssText = this.getDropdownStyles();
        ThemeManager.AVAILABLE_THEMES.forEach(theme => {
            const option = document.createElement("option");
            option.value = theme;
            option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
            select.appendChild(option);
        });
        select.addEventListener("change", e => this.loadTheme(e.target.value));
        return select;
    }
    getDropdownStyles() {
        return `
            appearance: none;
            width: 100%;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            border: 2px solid rgba(255, 255, 255, 0.2);
            padding: 10px 15px;
            border-radius: 8px;
            outline: none;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M1 4l5 5 5-5' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 15px center;
        `;
    }
    setupEventListeners() {
        document.addEventListener("keydown", e => {
            if (e.key === "t" || e.key === "T") {
                this.toggleThemeSelector();
            }
        });
    }
    toggleThemeSelector() {
        if (!this.themeSelector) return;
        const isHidden = this.themeSelector.style.display === "none";
        this.themeSelector.style.display = isHidden ? "block" : "none";
        if (isHidden) {
            const currentTheme = document.querySelector("link[data-theme]")?.dataset.theme || "beige";
            const select = this.themeSelector.querySelector("select");
            if (select) select.value = currentTheme;
        }
    }
    loadTheme(themeName) {
        if (!ThemeManager.AVAILABLE_THEMES.includes(themeName)) {
            console.error(`Invalid Theme: ${themeName}. Available Themes: ${ThemeManager.AVAILABLE_THEMES.join(", ")}`);
            return;
        }
        this.removeExistingTheme();
        this.applyNewTheme(themeName);
    }
    removeExistingTheme() {
        const existingTheme = document.querySelector("link[data-theme]");
        if (existingTheme) {
            existingTheme.remove();
        }
    }
    applyNewTheme(themeName) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        if (DEFINE_LOCAL) link.href = `http://localhost:8080/${themeName}.css`;
        else link.href = `https://whosejam.site/${themeName}.css`;
        link.dataset.theme = themeName;
        document.head.appendChild(link);
        const selector = document.querySelector("#theme-selector select");
        if (selector) {
            selector.value = themeName;
        }
    }
    static initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get("theme") || "beige";
        return new ThemeManager().loadTheme(theme);
    }
}

window.addEventListener("load", () => {
    const themeManager = new ThemeManager();
    themeManager.loadTheme("beige");
});

includeHTML(window.MyRevealCallback);

const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

let parsed = false;
let config = undefined;

const configHints = {
    animationOutputPath: "Default output path for animation (For example: C:/Users/xxx/Desktop/output)",
    pptOutputPath: "Default output path for PPT (For example: C:/Users/xxx/Desktop/output)",
    releaseOutputPath: "Default output path for release package (For example: C:/Users/xxx/Desktop/release)",
    ragOutputPath: "Default output path for RAG text files (For example: C:/Users/xxx/Desktop/rag)",
};

module.exports = {
    parseInput() {
        if (parsed) return;
        parsed = true;
        const args = process.argv.slice(2);
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const key = arg.replace(/^-/, "");
            const value = args[i + 1];
            if (arg.startsWith("-")) {
                if (!value || value.startsWith("-")) {
                    global[key] = true;
                } else {
                    global[key] = value;
                    i++;
                }
            } else {
                global[key] = true;
            }
        }
    },
    parseConfig(key) {
        if (config === undefined) {
            try {
                config = require("../myconfig.json");
            } catch (e) {
                const configPath = path.join(__dirname, "..", "myconfig.json");
                fs.writeFileSync(configPath, JSON.stringify({}, null, 4));
            }
        }
        if (!config || !config[key]) {
            console.log(colors("red", `[Error] Configuration key '${key}' not found. Please check the configuration.`));
            console.log(colors("cyan", configHints[key]));
            process.exit(1);
        }
        return config[key];
    },
};

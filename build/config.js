#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

const configKeys = ["animationOutputPath", "pptOutputPath", "releaseOutputPath"];

const configHints = {
    animationOutputPath: "Default output path for animation (For example: C:/Users/xxx/Desktop/output)",
    pptOutputPath: "Default output path for PPT (For example: C:/Users/xxx/Desktop/output)",
    releaseOutputPath: "Default output path for release package (For example: C:/Users/xxx/Desktop/release)",
};

function printSupportedKeys() {
    console.log(colors("cyan", "Supported configuration keys:"));
    configKeys.forEach(supportedKey => {
        console.log(colors("green", `- ${supportedKey}: `) + colors("yellow", configHints[supportedKey]));
    });
}

function validateConfigKey(key) {
    if (!configKeys.includes(key)) {
        console.log(colors("red", `[Error] Unsupported configuration key: ${key}`));
        printSupportedKeys();
        process.exit(1);
    }
}

function updateConfig(configPath, key, value) {
    try {
        validateConfigKey(key);
        let config = {};
        try {
            config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        } catch (readError) {
            if (readError.code !== "ENOENT") {
                console.error(colors("red", `Error reading config file: ${readError.message}`));
                process.exit(1);
            }
        }
        config[key] = value;
        try {
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
            console.log(colors("green", `Successfully updated `) + colors("cyan", key) + colors("green", ` to `) + colors("cyan", value) + colors("green", ` in ${configPath}`));
        } catch (writeError) {
            console.error(colors("red", `Error writing to config file: ${writeError.message}`));
            process.exit(1);
        }
    } catch (error) {
        console.error(colors("red", `Unexpected error: ${error.message}`));
        process.exit(1);
    }
}

function main() {
    const configPath = path.join(__dirname, "..", "myconfig.json");
    if (process.argv.length !== 4) {
        console.log(colors("cyan", "Usage: ") + colors("green", "node config.js <key> <value>"));
        printSupportedKeys();
        process.exit(1);
    }
    const key = process.argv[2];
    const value = process.argv[3];
    updateConfig(configPath, key, value);
}

main();

const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const webpack = require("webpack-stream");
const TerserPlugin = require("terser-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

function extractReversedNames() {
    const filePath = path.join(__dirname, "../SD/sd.ts");
    try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const regex = /\{([^}]+)\}/g;
        const matched = new Set();
        let match;
        while ((match = regex.exec(fileContent)) !== null) {
            match[1].split(",").forEach(content => {
                const trimmed = content.trim();
                if (trimmed !== "CONTINUE_STAGE" && !matched.has(trimmed) && /^[A-Z]/.test(trimmed))
                    matched.add(trimmed);
            });
        }
        return [...matched];
    } catch (error) {
        console.error("Error reading sd.ts file:", error.message);
        return [];
    }
}

module.exports = function (targetFolder) {
    return gulp
        .src(["./SD/sd.ts"])
        .pipe(webpack(getConfiguration()))
        .on("error", function (err) {
            console.error("Webpack compilation error:", err.message);
            this.emit("end");
        })
        .pipe(gulp.dest(targetFolder));
};

function getConfiguration() {
    const isDevelopment = global["d"] || false;
    const isWatch = global["w"] || false;
    const mode = isDevelopment ? "development" : "production";
    const plugins = [];

    if (!isDevelopment) {
        plugins.push(
            new JavaScriptObfuscator({
                identifierNamesGenerator: "mangled",
                splitStrings: true,
                rotateStringArray: true,
                shuffleStringArray: true,
                stringArray: true,
                simplify: true,
                reservedNames: extractReversedNames(),
                compact: true,
                controlFlowFlattening: false,
            })
        );
    }

    return {
        mode,
        watch: isWatch,
        plugins,
        output: {
            filename: "sd.js",
            library: "sd",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this",
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                allowJs: true,
                                jsx: "react",
                                esModuleInterop: true,
                                allowSyntheticDefaultImports: true,
                                target: "ES6",
                                module: "ESNext",
                                moduleResolution: "Node",
                                resolveJsonModule: true,
                                sourceMap: isDevelopment,
                                strict: false,
                                skipLibCheck: true,
                                allowDeclareFields: true,
                            },
                            transpileOnly: true,
                            experimentalFileCaching: true,
                            happyPackMode: false,
                        },
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
        optimization: {
            minimize: !isDevelopment,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true,
                        compress: {
                            drop_console: !isDevelopment,
                            drop_debugger: !isDevelopment,
                        },
                    },
                    parallel: true,
                    extractComments: false,
                }),
            ],
        },
        cache: {
            type: "filesystem",
            buildDependencies: { config: [__filename] },
        },
        resolve: {
            alias: { "@": path.resolve(global["projectRoot"], "SD") },
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            symlinks: false,
        },
        externals: { dagre: "dagre" },
        stats: isDevelopment ? "minimal" : "normal",
    };
}

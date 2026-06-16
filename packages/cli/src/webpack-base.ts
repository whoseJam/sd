export function tsLoaderRule(isDev: boolean) {
  return {
    test: /\.(ts|tsx|js|jsx)$/,
    // The framework packages (reveal / webslides / impress) intentionally
    // ship src/main.ts as source: cli compiles it per-deck so the
    // DOMAIN DefinePlugin substitution and per-deck assets can be inlined.
    // Everything else under node_modules is pre-compiled, and any TS
    // there would be a sign of misuse.
    exclude:
      /node_modules\/(?!(@whosejam\/sd-(reveal|webslides|impress)\/|\.pnpm\/[^/]*@whosejam\+sd-(reveal|webslides|impress)\+))/,
    use: {
      loader: "ts-loader",
      options: {
        compilerOptions: {
          allowJs: true,
          jsx: "react" as const,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          target: "ES6",
          module: "ESNext",
          moduleResolution: "Node",
          resolveJsonModule: true,
          sourceMap: isDev,
          strict: false,
          skipLibCheck: true,
          allowDeclareFields: true,
        },
        transpileOnly: true,
        experimentalFileCaching: true,
      },
    },
  };
}

export const cssRule = {
  test: /\.css$/,
  use: ["style-loader", "css-loader"],
} as const;
export const scssRule = {
  test: /\.scss$/,
  use: ["style-loader", "css-loader", "sass-loader"],
} as const;

export function tsLoaderRule(isDev: boolean) {
  return {
    test: /\.(ts|tsx|js|jsx)$/,
    // Don't blanket-exclude node_modules: @whosejam/sd-* src-ship their
    // TS sources, which webpack must transpile when consumed externally.
    // pnpm puts the real files at node_modules/.pnpm/...+sd-core...,
    // so the exclude has to whitelist that pnpm-flat path too.
    exclude: /node_modules\/(?!(@whosejam\/|\.pnpm\/[^/]*@whosejam\+))/,
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

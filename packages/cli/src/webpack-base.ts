export function tsLoaderRule(isDev: boolean) {
  return {
    test: /\.(ts|tsx|js|jsx)$/,
    exclude: /node_modules/,
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

export const cssRule = { test: /\.css$/, use: ["style-loader", "css-loader"] } as const;
export const scssRule = { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] } as const;
export const perfHints = { hints: false } as const;

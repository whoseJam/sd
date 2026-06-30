# sd

`sd` 是一个用 TypeScript 写算法课件和动画的 monorepo。`packages/` 里是运行时、布局、Reveal 集成、CLI 和 agent 插件；`examples/` 里是示例 deck 和动画。

这份 README 说明怎么维护和运行这个仓库本身。写 deck 的风格约定、动画 API 速查和截图工作流在 `@whosejam/sd-agents` 插件里。

## 环境

需要：

- Node.js 20+
- pnpm
- Bun，用于 `pnpm open`、`pnpm start`、`pnpm snap`

首次使用这个仓库：

```bash
pnpm install
pnpm build
```

## 最常用的预览流程

打开一个 deck：

```bash
pnpm open hello
pnpm open 枚举
```

运行后会自动打开浏览器。之后直接编辑 deck 或 animation 文件，保存后页面会自动刷新。

如果浏览器没有自动打开，手动访问：

```text
http://127.0.0.1:8765/previews/decks/<name>/reveal/index.html
```

默认输出都在仓库的 `./dist` 下。watcher 日志在 `dist/view-logs/`，截图默认在 `dist/snapshots/`。

可以同时预览多个 deck。`sd` 和 `reveal` watcher 是共享的；每个 deck 有自己的 `ppt` 和 `animation-group` watcher，输出目录也互不覆盖。

关闭预览：

```bash
pnpm close hello      # 只关 hello 的 watcher
pnpm close           # 关掉所有 open 启动的 watcher
pnpm stop            # 关 watcher，并停止 8765 预览服务器
```

如果 8765 已经被别的服务占用，`pnpm start` 会报错。可以换端口：

```bash
PORT=9000 pnpm open hello
```

PowerShell：

```powershell
$env:PORT = "9000"; pnpm open hello
```

## 自定义输出目录

预览输出默认写到当前项目的 `./dist`。如果想放到别处，可以设置 `REVEAL_ROOT`：

```bash
REVEAL_ROOT=/tmp/sd-preview pnpm open hello
```

PowerShell：

```powershell
$env:REVEAL_ROOT = "C:\sd-preview"; pnpm open hello
```

## 构建 package

首次 clone 或更新 package 源码后，先跑一次 `pnpm build`。它会构建各 package 的 `dist/`，并准备预览所需的共享 `dist/sd.js` 和 `dist/reveal.js`。`pnpm open` 只负责构建当前预览目标。

构建所有 workspace package 的 `dist/`：

```bash
pnpm build
```

开发 package 本身时跑 watch：

```bash
pnpm dev
```

这类构建会产出 npm package 文件，比如 `packages/core/dist`、`packages/layout/dist`、`packages/reveal/dist`、`packages/cli/dist`，也会更新仓库根目录的 `dist/sd.js` 和 `dist/reveal.js`。

## 低层构建任务

`pnpm open` 内部会调用 CLI 的低层任务来生成 `sd.js`、`reveal.js`、deck wrapper 和 animation bundle。日常开发不需要直接调用这些任务；只有在排查打包问题或验证发布产物时才需要绕过 `pnpm open`。

低层任务不会读取项目配置文件。需要自定义输出位置时，调用方显式传 `-o <output-dir>`。

## 截图

先用 `pnpm open` 或 `pnpm start` 保证页面在预览服务器上，然后：

```bash
pnpm snap /previews/decks/hello/reveal/index.html
pnpm snap /previews/decks/hello/reveal/index.html --slide 1
pnpm snap /previews/decks/hello/animation/circle.html --pause 2
```

截图默认输出到 `dist/snapshots/`，也可以传 `-o <path>` 指定输出文件。

## Agent 插件

Claude Code：

```bash
claude plugin marketplace add whoseJam/sd
claude plugin install sd-agents@sd
```

装好后重启 Claude Code 或执行 `/reload-plugins`。插件会在写 sd deck、调用 `sd.X`、预览或截图时加载对应 skill。

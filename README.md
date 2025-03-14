# 步骤

## 动画生成

### 环境搭建

到项目根目录下，使用 `npm install` 安装必要的依赖

到项目根目录下，新建 `myconfig.json`，在里面填写基础的配置文件，形如：
```
{
    "defaultAnimationTargetFilePath": "C:/Users/xxx/Desktop/output/animation",
    "defaultPPTTargetFilePath": "C:/Users/xxx/Desktop/output"
}
```

分别表示**默认动画输出路径**，以及**默认 ppt 输出路径**

接下来就能愉快地使用这个框架啦

#### 更好的体验

在 vscode 上可以下载这么几个插件：

1. JavaScript and TypeScript Nightly
2. js snippets
3. fitten code：一个AI补全代码的插件

### 使用教程

所有命令都在项目根目录下执行

`gulp lib` 用于生成库文件，它会输出到**默认动画输出路径**下

`gulp ani -i <input_file_path>` 用于生成动画文件，它也会输出到**默认动画输出路径**下

我们提供了 `gulp animation -i <input_file_path>` 用于简化命令编写，即：

`gulp animation -i <input_file_path>` = `gulp lib` + `gulp ani -i <input_file_path>`

#### 使用例子

- `gulp animation -i ./unit/rect.js`
- `gulp animation -i ./work/LCA/animation/LCA预处理.js`

## ppt 生成

咕咕咕
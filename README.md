# 环境搭建

到项目根目录下，使用 `npm install` 安装必要的依赖。

到项目根目录下，新建 `myconfig.json`，在里面填写基础的配置文件，形如：

```
{
    "animationOutputPath": "C:/Users/xxx/Desktop/output/animation",
    "pptOutputPath": "C:/Users/xxx/Desktop/output"
}
```

分别表示**默认动画输出路径**，以及**默认 ppt 输出路径**。

接下来就能愉快地使用这个框架啦。

#### 更好的体验

在 `vscode` 上可以下载这么几个插件：

1. `JavaScript and TypeScript Nightly`：不知道具体作用，总之作者有。
2. `js snippets`：不知道具体作用，总之作者有。
3. `Prettier - Code formatter`：给代码格式化的。如果你希望你的所有动画代码保持相同的代码风格，则可以使用此插件。
4. `HTML Boilerplate`：不知道具体作用，总之作者有。
5. `HTML CSS Support`：不知道具体作用，总之作者有。



---



# 任务

本框架使用 `gulp` 作为任务管理中枢，其内定义了 `animation` 任务用于生成动画，定义了 `ppt` 任务生成课件。



## 动画任务

使用 `animation` 任务来生成动画。相关指令如下：

```
gulp animation -i <动画文件>
```

### 配置项

- `-i`：指定输入文件（即动画文件），这是必填项。

```
gulp animation -i ./example/animation/rect.js
```

- `-o`：指定输出路径，如果没有指定，则使用 `animationOutputPath` 作为默认输出路径。

```
gulp animation -i ./example/animation/rect.js -o ../output
```

- `-w`：是否监听动画文件变动。默认不开启。开启监听后，此任务会变成长期任务，动画文件一旦改变，则输出会自动改变。这在编写动画文件、做调试的时候很有用。

```
gulp animation -i ./example/animation/rect.js -w
```

- `-l`：使用本地的动画库。默认不使用，而是会从作者的网站上加载动画库，这样的好处是可以拉取到最新版的动画库，坏处是第一次加载略慢。使用本地的动画库则需要自己把动画库挂到 `localhost:8080` 上，通过 `http://localhost:8080/sd.js` 进行访问。

```
gulp animation -i ./example/animation/rect.js -l
```



## PPT任务

使用 `ppt` 任务来生成课件。相关指令如下：

```
gulp ppt -i <PPT所在目录>
```

### 配置项

- `-i`：指定PPT所在的路径，只有当该路径下存在 `ppt.html` 文件时此路径才被视为是一个合法的路径，其中 `ppt.html` 被视作PPT的入口文件。这是必填项。

```
gulp ppt -i ./example/ppt/队列
```

- `-o`：指定输出路径，如果没有指定，则使用 `pptOutputPath` 作为默认输出路径。

```
gulp ppt -i ./example/ppt/队列 -o ../output
```

- `-w`：是否监听PPT的变动，包括所有HTML文件、动画文件、图片文件等等的变动。默认不开启。开启监听后，此任务会变成长期任务，一旦监听到任何变动，对应输出就会改变。这在编写PPT、做调试的时候很有用。

```
gulp ppt -i ./example/ppt/队列 -w
```

- `-l`：使用本地的库。默认不使用，而是会从作者的网站上加载库，这样的好处是可以拉取到最新版的库，坏处是第一次加载略慢。使用本地的库则需要自己把库挂到 `localhost:8080` 上，通过 `http://localhost:8080/???.js` 进行访问。
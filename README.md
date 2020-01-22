# react-demo

> REACT 安装配置 及页面框架案例

## 开发环境

### 1. 安装并配置编辑器

- [VS Code](https://code.visualstudio.com/) - 编辑器

```jsonc
> mkdir .vscode && cd .vscode && touch settings.json
{
  "editor.rulers": [100],
  "editor.formatOnSave": true,
}
```

### 2. 项目架构

```项目架构

//
react-case
  │
  ├─config  // 项目配置文件
  └─src
      │  index.js  // 主页首页, 源码根目录存放入口HTML文件
      │
      │  template.ejs // 页面模板, 页面生成模板
      │  loading.ejs  // 页面等待加载模板
      │
      ├─components // 公共组件目录
      ├─page       // 页面业务目录
      └─static     // 资源目录
          ├─css    // 样式资源
          ├─icons  // 图标资源
          └─img    // 图片资源

  // 根项目文件
    │  .babelrc           // babel配置
    │  .eslintrc          // eslint 配置
    │  gulpfile.js        // gulp 配置
    │  webpack.config.js  // webpack 打包构建配置
    │  .gitignore         // git 配置
    │  LICENSE            // 协议
    │  README.md          // 项目说明文件
    └─ package.json       // 项目文件

  > 01 搭建基本项目框架目录结构及文件创建

    : 创建并初始化项目
    > mkdir react-case && cd react-case & npm i
    > package.json

    : 目录架构
    > mkdir config && mkdir src
    > mkdir src/components && mkdir src/home && mkdir src/home && mkdir src/static
    > mkdir src/static/css && mkdir src/static/icons && mkdir src/static/img

    : 主要项目文件
    > touch README.md
    > touch LICENSE
    > touch .gitignore

```

```项目搭建步骤

    // A. 确定项目主框架及生态技术体系选型 -> react
    : 01 react
    > npm install react@^16.1.1 react-dom@^16.1.1 --save

    : 01 react-router
    > react-router@^4.0.0 react-router-dom@^4.0.0

    // B. 确定项目工程化, 打包构建工具选型
    : 02 webpack
    > npm install webpack@3.0.0 webpack-dev-server@2.5.0 --save-dev
    > npm install html-webpack-plugin@^2.28.0 --save-dev
    > touch webpack.config.js

    : 02 gulp
    > gulp@^3.9.1 gulp-sftp@^0.1.5 gulp-ssh@^0.6.0
    > touch gulpfile.js

    // C. 配置基本 babel 及 各种资源管理 babel 及 常用功能插件
    : 03 babel
    > npm install babel-loader@^7.1.5,6.4.1 babel-core@6.24.0 --save-dev
    > npm install babel-preset-es2015@^6.24.0 babel-preset-env@^1.7.0 babel-preset-stage-0@^6.22.0 --save-dev
    > npm install babel-preset-react@^6.23.0 --save-dev
    > babel-plugin-import@^1.1.1

    : 03 各种资源 loader
    > url-loader@^2.1.0,"0.5.8" file-loade@^4.1.0,0.11.1

    # 字体及图标资源
    > svg-sprite-loader@^0.3.0

    # JS 资源
    // 按需加载 chunk
    > bundle-loader@^0.5.6,"0.5.5"
    // 按需加载
    > babel-plugin-lodash@^3.3.2 lodash-webpack-plugin@^0.11.5
    // JS 压缩
    > webpack-parallel-uglify-plugin@^1.1.0
    // 清理文件
    > clean-webpack-plugin@^0.1.16
    > webpack-md5-hash@0.0.6
    // gzip压缩
    > compression-webpack-plugin@^1.1.11

    # CSS 资源理
    > less@^2.7.2 less-loader@^5.0.0,"4.0.2"
    > css-loader@^3.1.0,0.27.3
    > style-loader@^0.23.1,0.16.1
    > postcss-loader@^3.0.0,2.0.6 postcss-pxtorem@^4.0.1
    // CSS
    > optimize-css-assets-webpack-plugin@^1.3.1
    > extract-text-webpack-plugin@2.1.0//@^3.0.2","

    // D. 项目工程化, 代码规范及风格选型及其配置
    : 04 eslint 代码规范
    > eslint@^3.19.0 eslint-loader@^2.2.1,1.7.1 babel-eslint@^7.2.3
    > eslint-plugin-react@^6.10.3

    : 04 git 代码规范检查
    > pre-commit@1.2.2

    : 05 工具及第三方模块包
    : 命令行参数解析
    > minimist@1.2.0

```

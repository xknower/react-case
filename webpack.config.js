const path = require("path");
const fs = require("fs");
//
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
// gzip压缩
const CompressionPlugin = require("compression-webpack-plugin");
// 文件压缩
const WebpackParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// 清除文件
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 按需加载
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
// 优化缓存
const WebpackMd5Hash = require("webpack-md5-hash");
// CSS
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const pxtorem = require("postcss-pxtorem");

// 页面配置, 入口文件配置
const page = require("./config/page.js");
// 服务器配置
const devServer = require("./config/server.js");

// 当前运行环境
const nodeEnv = process.env.NODE_ENV || "development";
const isPro = nodeEnv === "production";
console.log("当前运行环境：", isPro ? "production" : "development");

// 字体及图标等资源
const svgDirs = [
  // 1. 属于 antd-mobile 内置 svg 文件， ant  使用Icon需要
  // require.resolve('antd-mobile').replace(/warn\.js$/, ''),
  // 2. 自己私人的 svg 存放目录
  path.resolve(__dirname, "src/static/icons")
];

// if (isPro) {
//     /**
//      * 解决动画样式问题
//      * 有些processor有副作用，慎用，必要时可关闭，http://cssnano.co/guides/advanced-transforms/
//      */
//     const disableList = ["zindex", "normalizeUrl", "discardUnused", "mergeIdents", "reduceIdents", "autoprefixer"];
//     let disableOption = {};
//     disableList.forEach(item => {
//     disableOption[item] = false;
//     });
//     plugins.push(
//         // css压缩
//         new OptimizeCssAssetsPlugin({
//             cssProcessor: require('cssnano')(disableOption),
//             cssProcessorOptions: { discardComments: {removeAll: true } }
//         }),
//         // js压缩
//         new UglifyJsPlugin({
//             output: {
//                 comments: false,  // remove all comments
//             },
//             compress: {
//                 warnings: false,
//                 join_vars: true,
//             },
//             toplevel: false,
//         })
//     )
// }

// entry 配置
const entry = {};
const loading = {
  html: fs.readFileSync(path.join(__dirname, "./src/loading.ejs"))
};

page.list.map(function(item, index) {
  let _obj = {
    [item.name]: [item.entry, ...page.scripts]
  };
  //
  Object.assign(entry, _obj);
});

// 插件配置
const plugins = [
  // 3.0 功能 范围提升 (Scope Hoisting)
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  //
  // 指定css文件名 打包成一个css | 注释 ——> 分开打包多个
  // new ExtractTextPlugin('style.css'),
  // 分开打包多个css
  new ExtractTextPlugin({
    filename: "[name].[contenthash:8].bundle.css",
    allChunks: true
  }),
  // 第三方库模块
  new CommonsChunkPlugin({
    name: "vendor",
    minChunks: ({ resource }) =>
      resource &&
      resource.indexOf("node_modules") >= 0 &&
      resource.match(/\.js$/)
  }),
  // 业务模块
  new CommonsChunkPlugin({
    name: ["react"],
    children: true, // 寻找所有子模块的共同依赖
    minChunks: 4 // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码
  }),
  // 按需加载
  new LodashModuleReplacementPlugin(),
  //
  new WebpackMd5Hash(),
  // 压缩
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.(js|html)$/,
    threshold: 10240,
    minRatio: 0.8
  }),
  new WebpackParallelUglifyPlugin({
    uglifyJS: {
      mangle: false,
      output: {
        beautify: false,
        comments: false
      },
      compress: {
        // warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true
      }
    }
  }),
  // 清理文件
  new CleanWebpackPlugin(
    ["dist/**"], // 匹配删除的文件
    {
      root: __dirname, // 根目录
      verbose: true, // 开启在控制台输出信息
      dry: false // 启用删除文件
    }
  ),
  //
  // new webpack.LoaderOptionsPlugin({
  //     options: {
  //         postcss: [pxtorem({
  //             rootValue: 100,
  //             propWhiteList: [],
  //         })],
  //     }
  // }),
  // hot 检测文件改动替换 plugin
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
];

// 生成html配置
page.list.map(function(item, index) {
  plugins.push(
    new HtmlWebpackPlugin({
      template: item.template,
      title: item.title,
      filename: item.filename,
      hash: true,
      // 将文件(JS)和公共依赖文件打包到HTML文件
      chunks: [item.chunks, "react", "vendor"],
      minify: {
        // 去注释
        removeComments: true,
        // 压缩空格
        collapseWhitespace: true,
        // 去除属性引用
        removeAttributeQuotes: true
      },
      loading
    })
  );
});

//
const rules = [
  {
    test: /\.less$/,
    // use: ['style-loader', 'css-loader', 'less-loader']      // 将css打包到js里面
    // 将css单独打包, 需要plugins
    use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      // resolve-url-loader may be chained before lesss-loader if necessary
      use: [
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            plugins: loader => [
              // 高清方案，将px转换为rem
              pxtorem({
                rootValue: 100,
                propWhiteList: []
              })
            ]
          }
        },
        {
          loader: "less-loader",
          options: {
            modifyVars: {
              "@hd": "2px"
            }
          }
        }
      ]
    })
  },
  //
  {
    test: /\.css$/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          plugins: loader => [
            pxtorem({
              // 高清方案，将px转换为rem
              rootValue: 100,
              propWhiteList: []
            })
          ]
        }
      }
    ]
  },
  // eslint
  {
    test: /\.js[x]?$/,
    enforce: "pre",
    use: [
      {
        loader: "eslint-loader",
        options: { fix: true }
      }
    ],
    include: path.resolve(__dirname, "./src/**/*.js"),
    exclude: /node_modules/
  },
  {
    test: /\.js[x]?$/,
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["es2015", "stage-0", "react"],
          plugins: [["import", { libraryName: "antd-mobile", style: true }]]
        }
      }
    ],
    exclude: /node_modules/
  },
  {
    test: /\.(svg)$/i,
    use: ["svg-sprite-loader"],
    // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
    include: svgDirs
  },
  {
    test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
    use: ["url-loader"]
  },
  {
    test: /\.(png|jpg)$/,
    use: ["url-loader?limit=8192&name=images/[hash:8].[name].[ext]"]
  }
];

//
module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: entry,
  output: {
    path: path.resolve(__dirname, "./dist"),
    // filename: '[name].[chunkhash:8].bundle.js', // 推荐使用 , 但是--hot会报错
    filename: "[name].[hash:8].bundle.js", // --hot时使用, 不推荐
    chunkFilename: "[name]-[id].[chunkhash:8].bundle.js" // 代码分割
  },
  module: {
    rules
  },
  // ant需要
  // resolve: {
  //     modules: ['node_modules', path.join(__dirname, './node_modules')],
  //     extensions: ['.web.js', '.js', '.json'], // webpack2 不再需要一个空的字符串
  // },
  // 不需要打包的模块插件
  plugins,
  // 配置服务器
  devServer
};

const path = require("path");
//
const proxy = require("./proxy");

// 配置服务器
module.exports = {
  contentBase: path.resolve(__dirname, "./dist"),
  host: "localhost",
  port: 8001,
  proxy: proxy,
  hot: true
};

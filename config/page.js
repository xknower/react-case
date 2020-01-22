// 页面配置
// entry 和 chunks, 名称必须相同
module.exports = {
  list: [
    {
      name: "index",
      entry: "./page/index.js",
      title: "主页",
      filename: "index.html",
      template: "template.ejs",
      chunks: "index"
    }
  ],
  //
  scripts: []
};

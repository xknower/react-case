"use strict";

var gulp = require("gulp");
var GulpSSH = require("gulp-ssh");
// 命令行参数解析
var minimist = require("minimist");

// 引入配置
var deployConfig = require("./config/deploy-dev.js");

// 构建资源目录
let assetsContents = "./dist";

var knownOptions = {
  string: "env",
  default: { env: process.env.NODE_ENV || "production" }
};

// 接收命令行参数 --env production
var options = minimist(process.argv.slice(2), knownOptions);
console.log("您将要部署的服务器是: ", options.env);

// serverName => env => production
var serverName = options.env;
var remoteServer = deployConfig[serverName];

/**
 * 打开ssh通道
 */
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: remoteServer.acct
});

/**
 * 执行命令 删除服务器现有文件
 */
gulp.task("execSSH", () => {
  return gulpSSH
    .shell(remoteServer.cmd, { filePath: "commands.log" })
    .pipe(gulp.dest("logs"));
});

/**
 * 上传文件
 */
gulp.task("deploy", ["execSSH"], () => {
  return gulp
    .src([assetsContents + "/**"])
    .pipe(gulpSSH.dest(remoteServer.remoteDir));
});

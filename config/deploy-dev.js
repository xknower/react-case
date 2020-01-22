// 部署配置
const dir = "/home/app/react-case";
//
module.exports = {
  // 一个部署服务器配置
  production: {
    // SSH 配置
    acct: {
      host: "localhost",
      port: 22,
      username: "root",
      password: "root"
    },
    // 执行命令 [部署前执行, 清除旧文件]
    cmd: ["rm -rf " + dir + "/*"],
    // 部署目录
    remoteDir: dir
  }
};

module.exports = {
    apps: [
      {
        // 生产环境
        name: "wedsee",
        // 项目启动入口文件
        script: "./server.js",
        // 项目环境变量
        env: {
          "NODE_ENV": "production"
        }
      },
  　　{
        // 测试环境
        name: "test",
        // 项目启动入口文件
        script: "./index.js",
        // 项目环境变量
        env: {
          "NODE_ENV": "test"
        }
      }
  ] }
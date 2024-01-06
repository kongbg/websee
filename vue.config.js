const { defineConfig } = require('@vue/cli-service');
const port = process.env.VUE_APP_NODE_PORT;
process.env.VUE_APP_VERSION = require('./package.json').version;
module.exports = defineConfig({
  productionSourceMap: false,// true生产环境生成sourceMap文件
  configureWebpack: {
    plugins: [],
  },
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  devServer: {
    port: process.env.VUE_PORT,
    proxy: {
      '/api': {
        target: `http://${process.env.VUE_APP_NODE_HOST}:${port}/`,
        changeOrigin: false,
        secure: false,
        // pathRewrite: {
        //   ['/api']: '',
        // },
      }
    }
  }
})

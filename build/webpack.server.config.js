const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，可以剔除一些未使用的node内部模块
  // 并且还会在编译 Vue 组件时，告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  devtool: '#source-map', //对 bundle renderer 提供 source map 支持
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2' //此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
  },
  resolve: {
    alias: {
    }
  },
  // 外置化应用程序依赖模块，可以使服务器构建速度更快，并生成较小的 bundle 文件
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 将css添加入白名单，是因为从以来模块倒入的css还应该有webpack处理
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
      // 将服务器的整个输出构建为一个单个json文件，文件名称默认为vue-ssr-server-bundle.json
    new VueSSRServerPlugin()
  ]
})

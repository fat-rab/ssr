const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map', // source map 支持(记录编译后代码到原始代码的映射关系)
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    // 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用
    // 或任何其他导入机制。忽略大型的 library 可以提高构建性能
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false //放弃模板标签之间的空格
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.styl(us)?$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: { minimize: true }
                },
                'stylus-loader'
              ],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
    ]
  },
  // 配置如何展示性能提示,例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
  performance: {
    hints: false //不展示警告或错误提示。
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(), //vue-loader V15之后需要配合这个插件使用
        new webpack.optimize.UglifyJsPlugin({  //对js文件进行压缩
          compress: { warnings: false }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(), //提升你的代码在浏览器中的执行速度
          // 将所有chunk引用的css，移动到独立的css文件中，可以做到更快的提前加载css
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin()
      ]
}

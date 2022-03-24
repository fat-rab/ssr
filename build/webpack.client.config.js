const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
// const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
 // 客户端配置和base 配置基本一样，除了需要将入口只想客户端文件
const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // 将webpack运行时分离到一个引导chunk中，以便在之后正确的注入chunk
      // 这也为你的 应用程序/vendor 代码提供了更好的缓存
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})

// if (process.env.NODE_ENV === 'production') {
//   config.plugins.push(
//     // auto generate service worker
//     new SWPrecachePlugin({
//       cacheId: 'vue-hn',
//       filename: 'service-worker.js',
//       minify: true,
//       dontCacheBustUrlsMatching: /./,
//       staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
//       runtimeCaching: [
//         {
//           urlPattern: '/',
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: /\/(top|new|show|ask|jobs)/,
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: '/item/:id',
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: '/user/:id',
//           handler: 'networkFirst'
//         }
//       ]
//     })
//   )
// }

module.exports = config

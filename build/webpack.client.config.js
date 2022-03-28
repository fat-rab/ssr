const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
// const PrerenderSPAPlugin = require('prerender-spa-plugin') //预渲染
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

// 客户端配置和base 配置基本一样
const config = merge(base, {
    entry: {
        app: './src/entry-client.js'
    },
    resolve: {
        alias: {}
    },
    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // 将依赖模块提取到 vendor chunk 以获得更好的缓存，是很常见的做法。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // 一个模块被提取到 vendor chunk 时……
                return (
                    // 如果它在 node_modules 中
                    /node_modules/.test(module.context) &&
                    // 如果 request 是一个 CSS 文件，则无需外置化提取
                    !/\.css$/.test(module.request)
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin()
    ]
})
// 只有在生产环境才需要预渲染
// if (process.env.NODE_ENV === 'production') {
//     config.plugins.push(
//         new HtmlWebpackPlugin({
//             template: 'src/prerender-template.html'
//         }),
//         new PrerenderSPAPlugin({
//             staticDir: path.join(__dirname, '../dist'),
//             routes: ['/about'] //预渲染的路由
//         })
//     )
// }

module.exports = config

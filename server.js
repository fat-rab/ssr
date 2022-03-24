const server = require('express')();
const {createBundleRenderer} = require('vue-server-renderer')
const fs = require('fs')
const path = require("path");
const isProd = process.env.NODE_ENV === 'production'
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require("./dist/vue-ssr-client-manifest.json")
const template = fs.readFileSync(path.join(__dirname, 'src/index.template.html'), 'utf-8')
const setupDevServer = require("./build/setup-dev-server")
const resolve = file => path.resolve(__dirname, file)
const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
function createRenderer(bundle, option) {
    return createBundleRenderer(bundle, Object.assign(option, {
        runInNewContext: false ////默认true，推荐false。如果为true，每次渲染都会创建一个新的v8,并且重新渲染，添加性能开销
    }))
}

let renderer
let readyPromise
if (isProd) {
    // 如果是生产环境
    renderer = createRenderer(bundle, {
        template,
        clientManifest //客户端构建 manifest
    })
} else {
    const templatePath = resolve('src/index.template.html')
    // 生产环境，setupDevServer 有监听和热更新功能
    readyPromise = setupDevServer(server, templatePath, (bundle, option) => {
        renderer = createRenderer(bundle, option)
    })
}

function render(req, res) {
    const s = Date.now()

    res.setHeader("Content-Type", "text/html")
    res.setHeader("Server", serverInfo)
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }

    const context = {
        title: 'Vue SSR 2.0', // default title
        url: req.url
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(html)
        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    })
}

server.get('*', (req, res) => {
    if (isProd) {
        render(req, res)
    } else {
        readyPromise.then(() => {
            render(req, res)
        })
    }
})
const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})

import {createApp} from './app'
// 使用export default 导出函数，每次渲染都会调用这个函数
export default context => {
    //因为有可能是异步路由钩子函数或者组件，所以使用promise
    //以便服务器可以等待所有内容在渲染前就已经准备就绪
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp()
        // 设置服务端router位置
        router.push(context.url)
        // 路由完成初始化导航时触发
        // 因为路由器必须提前解析 路由中配置的异步引入的组件，才能够正确的调用组件中可能存在的路由钩子
        // 所以需要在router.onReady中挂载app
        router.onReady(() => {
            // 获取匹配的路由
            const matchedComponents = router.getMatchedComponents()
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) reject({code: 404})
            Promise.all(matchedComponents.map((item) => {
                if (item.asyncData) {
                    return item.asyncData({store, route: router.currentRoute})
                }
            })).then(() => {
                // 此时store已经填充了需要的数据，此时将状态添加给上下文
                //并且 `template` 选项用于 renderer 时，状态将自动序列化为 window.__INITIAL_STATE__,注入到html
                context.state = store.state
                // promise 应该resolve app，以便它可以渲染
                resolve(app)
            }).catch(reject)

        }, reject)
    })

}

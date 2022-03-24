import {createApp} from './app'
import Vue from 'vue'
// 客户端只需要将app关在到DOM上
const {app, router, store} = createApp()
// 客户端挂载之前就应该获取到状态
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
// 因为路由器必须提前解析 路由中配置的异步引入的组件，才能够正确的调用组件中可能存在的路由钩子
// 所以需要在router.onReady中挂载app
router.onReady(() => {
    // 客户端预取数据方法1：在路由导航之前解析数据
    // 客户端端等待所需要的数据全部解析之后，在传入数据，渲染视图。好处是可以在数据准备就绪的时候，渲染完整视图。
    // 缺点是如果请求数据过大，用户可能会感觉到卡顿，所以最好添加一个loading指示器
    router.beforeResolve((to, from, next) => {

        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)

        let diff = false
        const activated = matched.filter((item, i) => {
            return diff || (diff = (item !== prevMatched[i]))
        })
        if (!activated.length) {
            return next()
        }
        // 这里如果有加载指示器 (loading indicator)，就触发
        Promise.all(activated.map((item) => {
            if (item.asyncData) {
                return item.asyncData({store, route: to})
            }
        })).then(() => {
            // 如果有加载指示器就停止
            next()
        }).catch(() => {
            next()
        })
    })
    // 强制使用激活模式挂载
    app.$mount('#app', true)
})
// 无论使用哪一种方法，当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 user/1 到 user/2）时，
// 也应该调用 asyncData 函数
Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options
        if (asyncData) {
            // 将获取数据操作分配给 promise,以便在组件中，我们可以在数据准备就绪后,
            // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
            asyncData({store: this.$store, route: to}).then(() => {
                next()
            }).catch(next)
        } else {
            next()
        }
    }
})
// 方法二：匹配到要渲染的视图之后，在获取数据
// 此时需要在beforeMount中获取数据，可以使用mixin混入全局
// Vue.mixin({
//     beforeMount() {
//         const {asyncData} = this.$options
//         if (asyncData) {
//             // 将获取数据操作分配给 promise,以便在组件中，我们可以在数据准备就绪后,
//             // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
//             this.dataPromise = asyncData({store: this.$store, route: this.$route})
//         }
//     }
// })


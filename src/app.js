import Vue from 'vue'
import App from './App.vue'
import {createStore} from './store'
import {createRouter} from './router'
import {sync} from 'vuex-router-sync'

import "./styles/index.stylus"
import titleMixin from './util/title'
// 混入获取标题的方法，然后在组件中暴露title函数或者属性，就可以不同页面设置不同标题
Vue.mixin(titleMixin)


//import * as filters from './util/filters'
// register global utility filters.
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key])
// })


export function createApp() {
    const store = createStore()
    const router = createRouter()
    // 自动创建一个默认名称为route的store，管理当前路由状态
    // 同步路由state 到 store
    sync(store, router)
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })
    return {app, router, store}
}

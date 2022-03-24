import Vue from 'vue'
import App from './App.vue'
import {createStore} from './store'
import {createRouter} from './router'
import {sync} from 'vuex-router-sync'
//import titleMixin from './util/title'
//import * as filters from './util/filters'

// mixin for handling title
//Vue.mixin(titleMixin)

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

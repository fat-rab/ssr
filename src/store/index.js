import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
// 由于服务端渲染期间，本质上渲染的是应用程序的快照，所以如果应用程序依赖一些异步数据，那么在渲染之前需要预取和解析好这些数据
export function createStore() {
    return new Vuex.Store({
        state: {
            list: []
        },
        actions,
        mutations
    })
}

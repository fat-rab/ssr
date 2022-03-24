import {getList} from '../api'

export default {
    GET_LIST: ({commit}) => {
        getList().then((res) => {
            commit('SET_LIST', res)
        })
    }
}

import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age: 10,
    name: '张三'
  },
  mutations: {
    addAge(state, payload) {
      state.age = state.age + payload
    },
    minusAge(state, payload) {
      state.age = state.age - payload
    },
    changeName(state, payload) {
      state.name = payload
    }
  },
  actions: {
    minusAge({commit}, payload) {
      commit('minusAge', payload)
    },
    minusAge1({commit}, payload) {
      commit('minusAge1', payload)
    }
  },
  getters: {
    getAge(state) {
      return state.age + 10
    },
    getName(state) {
      return `我是${state.name}`
    }
  },
  // modules: {
  //   a: {
  //     state: {a1: '我是a1'},
  //     getters: {
  //       getA1(state) {
  //         return '测试a模块的getters' + state.a1
  //       }
  //     },
  //     mutations: {
  //       addAge(state, payload) {
  //         console.log('a1模块')
  //         state.a1 = state.a1 + payload + 'a'
  //       },
  //     },
  //     actions: {
  //       minusAge1({commit}, payload) {
  //         commit('minusAge1', payload)
  //       }
  //     },
  //     modules: {
  //       c: {
  //         state: {c1: '我是c1'},
  //         getters: {},
  //         mutations: {},
  //         actions: {}
  //       },
  //     }
  //   },
  //   b: {
  //     state: {b1: '我是b1'},
  //     getters: {
        
  //     },
  //     mutations: {
  //       addAge(state, payload) {
  //         console.log('b模块')
  //         state.a1 = state.a1 + payload + 'b'
  //       }
  //     }
  //   }
  // }
})

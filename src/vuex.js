let Vue

class ModuleManager {
  constructor(options) {
    this.registerModule([], options)
  }
  registerModule(path, rootModule) {
    let _rawModule = {
      root: rootModule,
      children: {},
      state: rootModule.state
    }
    if (!path.length) {
      this.rootModule = _rawModule
    } else {
      let parent = path.slice(0, -1).reduce((prev, current) => {
          return prev.children[current]
      }, this.rootModule)
      parent.children[path[path.length - 1]] = _rawModule
    }
    if (rootModule.modules) {
      Object.keys(rootModule.modules).forEach((moduleName) => {
        this.registerModule(path.concat(moduleName), rootModule.modules[moduleName])
      })
    }  
  }

}
const installModule = (store, state, path, module) => {
  let getters = module.root.getters || {}
  let mumations = module.root.mutations || {}
  let actions = module.root.actions || {}
  // 处理state，将其变成{name: '测试', a: {}, b: {}} 就是包含了所有模块的state
  if (path.length) {
    let parent = path.slice(0, -1).reduce((state, current) => {
      return state[current]
    },state)
    Vue.set(parent, path[path.length - 1], module.state)
  }
  // 搜集所有的getters， 全部挂载到store.getters对象上
  Object.keys(getters).forEach((getterName) => {
    Object.defineProperty(store.getters, getterName, {
      get: () => {
        return getters[getterName](module.state)
      }
    })
  })

  // 搜集所有的mumations， 全部挂载到store.mumations对象上
  Object.keys(mumations).forEach((mutationName) => {
    let arr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
    arr.push((payload) => {
      mumations[mutationName](module.state, payload)
    })
  })

  // 搜集所有的actions， 全部挂载到store.actions对象上
  Object.keys(actions).forEach((actionName) => {
    let arr = store.actions[actionName] || (store.actions[actionName] = []);
    arr.push((payload) => {
      actions[actionName](store, payload)
    })
  })
  Object.keys(module.children).forEach(moduleName => {
    let childrenModule = module.children[moduleName]
    installModule(store, state, path.concat(moduleName), childrenModule)
  })
}
class Store {
  constructor(options) {
    this._state = new Vue({
      data: {
        state: options.state
      }
    })
    // let getters = options.getters || {}
    // let mutations = options.mutations || {}
    // let actions = options.actions || {}
    this.getters = {}
    this.mutations = {}
    this.actions = {}
    // this.initData(getters, this.getters, (key) => {
    //   return getters[key](this.state)
    // })
    // this.initData(mutations, this.mutations, (key) => {
    //   return (payload) => {
    //     mutations[key](this.state, payload)
    //   }
    // })
    // this.initData(actions, this.actions, (key) => {
    //   return (payload) => {
    //     actions[key](this, payload)
    //   }
    // })
    this.modules = new ModuleManager(options)
    installModule(this, this.state, [], this.modules.rootModule)
    console.log(this.modules)
  }
  initData(optionsProperty, ownProperty, fn) {
    Object.keys(optionsProperty).forEach(key => {
      Object.defineProperty(ownProperty, key, {
        get: fn.bind(this, key)
      })
    })
  }
  get state() {
    return this._state.state
  }
  commit = (type, payload) => {
    // this.mutations[type](payload)
    let fns = this.mutations[type]
    fns.forEach(fn => {
      fn(payload)
    })
  }
  dispatch = (type, payload) => {
    // this.actions[type](payload)
    let fns = this.actions[type]
    fns.forEach(fn => {
      fn(payload)
    })
  }
}
const install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}
export default {
  Store,
  install
}

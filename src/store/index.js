import { createEasyAccess, defaultMutations } from 'vuex-easy-access'
import getters from './getters'

Vue.use(Vuex)

const state = {
  authDictMap: {},
  currency: '',
  siteTitle: '',
  fileServer: '',
  countryList: [],
  country: {},
  tokenKey: '',
  token: '',
  loginInfo: null,
  authRouteCodes: [],
  authRouteList: [],
  menuTree: [],
  permissions: [],
  authRouteKeys: [],
  dataMapEnum: {},
  dataMapEntity: {},
}

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = modulesFiles(modulePath).default
  return modules
}, {})

const store = new Vuex.Store({
  state,
  modules,
  getters,
  plugins: [createEasyAccess()],
  mutations: {
    ...defaultMutations(state),
    addDataMapEntity(state, map) {
      for (const key of Object.keys(map)) {
        console.log(`map[key] ${key}`,map[key])
        Vue.set(state.dataMapEntity, key, map[key])
      }
    },
    addDataMapEnum(state, map) {
      for (const key of Object.keys(map)) {
        Vue.set(state.dataMapEnum, key, map[key])
      }
    },
    setState(state, { key, value }) {
      // 使用 Vue.set 动态添加新的状态变量
      Vue.set(state, key, value)
    }
  },
  actions: {
    async clearDataMapEntity({ commit, state }, dataEntitys = []) {
      if (dataEntitys) {
        let obj = {}
        dataEntitys.forEach(dataEntity=>{
          obj[dataEntity] = null
        })
        commit('addDataMapEntity', obj)
      }
    },
    async loadDataMapEntity({ commit, state }, dataEntitys = []) {
      if (dataEntitys) {
        dataEntitys = dataEntitys.filter(dataEntity => !state.dataMapEntity[dataEntity])
        if (dataEntitys.length) {
          // const map = {}
          // dataEntitys.forEach(d => { map[d] = [] })
          // commit('addDataMapEntity', map)
          commit('addDataMapEntity', await $$get('/common/selectListsSimple/' + dataEntitys.join(','), { enabled: 1 }))
        }
      }
    },
    async loadDataMapEnum({ commit, state }, dataEnums = []) {
      if (dataEnums) {
        dataEnums = dataEnums.filter(dataEnum => !state.dataMapEnum[dataEnum])
        if (dataEnums.length) {
          // const map = {}
          // dataEnums.forEach(d => { map[d] = [] })
          // commit('addDataMapEnum', map)
          commit('addDataMapEnum', await $$get('/common/dictEnumFull/' + dataEnums.join(',')))
        }
      }
    },
  }
})
export default store

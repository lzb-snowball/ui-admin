
import ParentJs from '@/parent-ui/src/main/js/index'
import ParentElement from '@/parent-ui/src/main/ui-element/index'
import ParentH5 from '@/parent-ui/src/main/ui-h5/index'
import { init, loadLoginData, logout } from '@/parent-ui/src/main/business/common/init'
import LoadingOverlay from '@/parent-ui/src/main/ui-h5/LoadingOverlay'
import Layout from '@/layout/index.vue'
import App from './App'
import axiosInstance from './axios/request'
import router from './router'
import store from './store'
import './icons' // icon
import '@/styles/index.scss'
import i18n from '@/parent-ui/src/main/business/common/i18n.js' // global css

initData()
async function initData() {
  LoadingOverlay.open()

  // 初始化整站数据
  await init(store)

  // 初始化公共工具类信息
  ParentJs.install(
    Vue,
    axiosInstance,
    store.get('fileServer'),
  )

  // console.log('store.get(\'country\').langCode',store.get('country').langCode)
  // 加载多语言
  await i18n.changeLanguage(store.get('country').langCode)

  Vue.use(ParentElement)
  Vue.use(ParentH5)

  const appName = process.env.VUE_APP_APPLICATION
  import(`@/styles/${appName}.css`);

  // 登录有效
  const validate = await $$get('/commonLogin/validate')
  if (validate) {
    await loadLoginData(store, router, Layout)
  }

  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  })
  // 登录无效
  if (!validate) {
    logout(store, router, '/login')
    // 重新连接websocket
  }
  LoadingOverlay.close()
}
Vue.config.productionTip = false

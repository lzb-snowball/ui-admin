// import axios from 'axios'
import store from '../store/index'
import ObjectUtil from '@/parent-ui/src/main/js/utils/ObjectUtil'

axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  baseURL: '/api', // api 的 base_url
  timeout: 60000 // 请求超时时间
})
// export const serviceDirect = axios.create({
//   baseURL: '/api', // api 的 base_url
//   timeout: 60000 // 请求超时时间
// })

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log('axios tokenKey', store.get('tokenKey'))
    // console.log('axios token', store.get('token'))
    config.headers[store.get('tokenKey')] = store.get('token')
    config.headers['Accept-Language'] = store.get('country').langCode
    if (config.method === 'get') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function(params) {
        return Qs.stringify(params, {
          allowDots: true,
          arrayFormat: 'indices'
        })
      }
    }
    return config
  },
  error => {
    // console.log('request', error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log('response',response)
    const url = response.config.url
    const res = response.data
    if (ObjectUtil.isEmpty(res.code)) {
      console.info('其他请求类型', url)
      // Promise.apply(response)
      return response // 其他请求类型
    } else {
      if (res.code === 0) {
        return res // 标准请求 成功
      } else {
        // let res = response.data
        return doError(url, res.code === 401, res.code, res.msg) // 标准请求 失败
      }
    }
  },
  error => {
    console.error('response error ' + response.config.url, error)
    const response = error.response
    if (response) {
      return doError(response.config.url, response.status === 401, response.status, '')
    } else {
      return doError(response.config.url, false, response.status, error.message)
    }
  }
)

function doError(url, isLoginError, status, errMsg) {
  errMsg = status + '|' + errMsg
  // errMsg = url + '|' + errMsg
  if (isLoginError) {
    console.warn(errMsg)

    // if (process.env.NODE_ENV === 'production') {
    //   // 登出
    //   store.dispatch('Logout')
    //   store.dispatch('user/FedLogOut').then(() => {
    //     location.reload() // 为了重新实例化vue-router对象 避免bug
    //   })
    // }
    debugger
    ELEMENT.MessageBox.confirm('请重新登陆', '登录已失效', {}).then((res) => {
      // 登出
      store.dispatch('Logout')
      store.dispatch('user/FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    })
  } else {
    console.error(url + '' + errMsg)
    ELEMENT.Message({
      title: '异常',
      message: errMsg,
      type: 'error',
      duration: 5 * 1000
    })
  }
  return Promise.reject(errMsg)
}

export default service
export const get = service.get
export const post = service.post

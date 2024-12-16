// import axios from 'axios'
import request from '@/axios/request'

const mixin = {
  components: {},
  filters: {},
  data() {
    return {}
  },
  created() {
  },
  methods: {
    async $page(entityName, params) {
      return await get(`/commonData/selectPage/${entityName}`, params)
    },
    async $list(entityName, params) {
      return await get(`/commonData/selectList/${entityName}`, params)
    },
    async $one(entityName, id) {
      return await get(`/commonData/selectOne/${entityName}/${id}`)
    },
    async $insert(entityName, data) {
      await post(`/common/insert/${entityName}`, data)
    },
    async $saveOrUpdate(entityName, data) {
      await post(`/common/insertOrUpdate/${entityName}`, data)
    },
    async $updateById(entityName, data) {
      await post(`/common/update/${entityName}`, data)
    },
    async $deleteById(entityName, id) {
      await post(`/common/delete/${entityName}/${id}`)
    }
  }
}
export default mixin

export const $page = mixin.methods.$page

export async function get(url, params) {
  return (await request.get(url, { params })).data
}
async function post(url, data) {
  return (await request.post(url, data)).data
}

import request from '@/axios/request'

export function getList(params) {
  return request({
    url: '/commonData/selectList/poster',
    method: 'get',
    params: params
  })
}

export function getDetail(id) {
  return request({
    url: '/commonData/selectById/poster/' + id,
    method: 'get'
  })
}

export function save(param) {
  return request({
    url: '/commonData/insertOrUpdate/poster',
    method: 'post',
    data: param
  })
}

export function delOne(id) {
  return request({
    url: '/commonData/delete/poster',
    method: 'post',
    data: { id }
  })
}
export function getLangDetail(params) {
  return request({
    url: '/commonData/selectOne/poster/',
    method: 'get',
    params: params
  })
}
export function getCountryList(params) {
  return request({
    url: '/commonData/selectList/country',
    method: 'get',
    params: params
  })
}

export function getAllList() {
  return request({
    url: '/commonData/selectList/posterCategory',
    method: 'get'
  })
}

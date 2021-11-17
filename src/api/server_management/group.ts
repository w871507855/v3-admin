/*
 * @Description: 资源组api
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 13:25:03
 * @LastEditTime: 2021-11-08 13:47:27
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 分页获取资源组
export function getAllGroup(data: any) {
  return request({
    url: 'groups',
    method: 'post',
    data
  })
}

// 新建资源组
export function createGroup(data: any) {
  return request({
    url: 'group',
    method: 'post',
    data
  })
}

// 更新资源组
export function updateGroup(data: any) {
  return request({
    url: 'group',
    method: 'put',
    data
  })
}

// 删除资源组
export function deleteGroup(id: number) {
  return request({
    url: `group/${id}`,
    method: 'delete'
  })
}

// 根据id查询资源组
export function getGroup(id: number) {
  return request({
    url: `group/${id}`,
    method: 'get'
  })
}

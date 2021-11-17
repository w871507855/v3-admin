/*
 * @Description: 服务器信息资源组
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 13:24:55
 * @LastEditTime: 2021-11-08 19:31:04
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 分页查询服务器
export function getAllServer(data: any) {
  return request({
    url: 'servers',
    method: 'post',
    data
  })
}

// 新建服务器
export function createServer(data: any) {
  return request({
    url: 'server',
    method: 'post',
    data
  })
}

// 更新服务器
export function updateServer(data: any) {
  return request({
    url: 'server',
    method: 'put',
    data
  })
}

// 删除服务器
export function deleteServer(id: number) {
  return request({
    url: `server/${id}`,
    method: 'delete'
  })
}

// 根据id查询
export function getServer(id: number) {
  return request({
    url: `server/${id}`,
    method: 'get'
  })
}

// 查询服务器硬件信息
export function getServerInfo(id: number) {
  return request({
    url: `server/info/${id}`,
    method: 'get'
  })
}

// 给服务器添加资源组
export function serverAddGroup(data: any) {
  return request({
    url: 'server/group',
    method: 'post',
    data
  })
}

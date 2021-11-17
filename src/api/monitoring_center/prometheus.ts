/*
 * @Description: prometheus api
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-17 10:15:08
 * @LastEditTime: 2021-11-17 11:43:35
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 获取prometheus监控到的机器
export function getProServers(data: any) {
  return request({
    url: 'targets',
    method: 'post',
    data
  })
}

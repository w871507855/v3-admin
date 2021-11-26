/*
 * @Description: 报警 api
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-17 10:15:29
 * @LastEditTime: 2021-11-18 17:04:42
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 获取报警列表
export function getAlarm() {
  return request({
    url: 'alerts',
    method: 'get'
  })
}

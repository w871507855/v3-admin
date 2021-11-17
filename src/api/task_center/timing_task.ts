/*
 * @Description: 定时任务接口
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-09 18:00:40
 * @LastEditTime: 2021-11-10 19:03:29
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 查询所有的定时任务
export function getAllTimingApi(data: any) {
  return request({
    url: 'timing_tasks',
    method: 'post',
    data
  })
}

// 创建定时任务
export function createTimingTask(data: any) {
  return request({
    url: 'timing_task/add',
    method: 'post',
    data
  })
}

// 删除定时任务
export function deleteTimingTask(data: any) {
  return request({
    url: 'timing_task/delete',
    method: 'post',
    data
  })
}

// 更新定时任务
export function updateTimingTask(data: any) {
  return request({
    url: 'timing_task/update',
    method: 'post',
    data
  })
}

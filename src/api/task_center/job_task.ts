/*
 * @Description: 自定义任务接口
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-09 18:00:18
 * @LastEditTime: 2021-11-10 10:38:28
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

// 执行自定义shell命令
export function taskShellApi(data: any) {
  return request({
    url: 'job_task/shell',
    method: 'post',
    data
  })
}

// 执行自定义script命令
export function taskScriptApi(data: any) {
  return request({
    url: 'job_task/script',
    method: 'post',
    data
  })
}

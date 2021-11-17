/*
 * @Description: 登录api
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 10:06:42
 * @LastEditTime: 2021-11-08 11:00:10
 * @LastEditors: lichengcheng
 */
import { request } from '@/utils/service'

interface IUserRequestData {
  username: string
  password: string
}

// 登录以后返回 token
export function accountLogin(data: IUserRequestData) {
  return request({
    url: 'login/access-token',
    method: 'post',
    data
  })
}
// 获取用户详情
export function userInfoRequest() {
  return request({
    url: 'user/info',
    method: 'get'
  })
}

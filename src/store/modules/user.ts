/*
 * @Description: 登录权限管理
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 10:06:42
 * @LastEditTime: 2021-11-08 11:38:37
 * @LastEditors: lichengcheng
 */
import { getToken, removeToken, setToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { accountLogin, userInfoRequest } from '@/api/login'
import { RouteRecordRaw } from 'vue-router'

export interface IUserState {
  token: string
  name: string
  avatar: string
  roles: string[]
}

const state: IUserState = {
  token: getToken() || '',
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state: IUserState, token: string) => {
    state.token = token
  },
  SET_NAME: (state: IUserState, name: string) => {
    state.name = name
  },
  SET_AVATAR: (state: IUserState, avatar: string) => {
    state.avatar = avatar
  },
  SET_ROLES: (state: IUserState, roles: string[]) => {
    state.roles = roles
  }
}

const actions = {
  // 登录
  async login({ commit }: any, userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    await accountLogin({ username, password }).then(async(res: any) => {
      if (res.code === 200 && res.data.accessToken) {
        console.log('token内容', res.data.accessToken)
        setToken(res.data.accessToken)
        commit('SET_TOKEN', res.data.accessToken)
      }
    }).catch((err) => {
      console.log(err)
    })
    // return new Promise((resolve, reject) => {
    //   console.log('开始登录', { username, password })
    //   accountLogin({ username, password }).then((res: any) => {
    //     if (res.code === 200 && res.data.accessToken) {
    //       console.log('获取的token', res.data)
    //       setToken(res.data.accessToken)
    //       commit('SET_TOKEN', res.data.accessToken)
    //       resolve(true)
    //     }
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },
  // 获取用户详情
  async getInfo({ commit }: any) {
    await userInfoRequest().then((res: any) => {
      console.log('获取用户信息1', res)
      if (res.code === 200) {
        console.log('获取用户信息2', res)
        commit('SET_EMAIL', res.data.email)
        commit('SET_AVATAR', res.data.avatar)
        commit('SET_ROLES', [res.data.authority.authority_name])
        return res
      } else {
        throw Error('Verification failed, please Login again.')
      }
    })
    // return new Promise((resolve, reject) => {
    //   userInfoRequest().then((res: any) => {
    //     console.log(res.data)
    //     commit('SET_NAME', res.data.user.name)
    //     commit('SET_AVATAR', res.data.avatar)
    //     commit('SET_ROLES', [res.data.authority.authority_name])
    //     resolve(res)
    //   }).catch(error => {
    //     console.log('报错了')
    //     reject(error)
    //   })
    // })
  },
  // 切换角色
  async changeRoles({ commit, state, dispatch, rootState }: any, role: string) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    await dispatch('getInfo')
    dispatch('permission/setRoutes', state.roles, { root: true })
    resetRouter()
    rootState.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  },
  // 登出
  logout({ commit }: any) {
    removeToken()
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    resetRouter()
  },
  // 重置 token
  resetToken({ commit }: any) {
    removeToken()
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

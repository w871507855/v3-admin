/*
 * @Description: cookies封装
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 10:06:42
 * @LastEditTime: 2021-11-08 11:32:30
 * @LastEditors: lichengcheng
 */
// cookies封装

import Keys from '@/constant/key'
import Cookies from 'js-cookie'

export const getSidebarStatus = () => Cookies.get(Keys.sidebarStatus)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(Keys.sidebarStatus, sidebarStatus)

export const getToken = () => Cookies.get(Keys.tokenKey)
export const setToken = (token: string) => Cookies.set(Keys.tokenKey, token)
export const removeToken = () => Cookies.remove(Keys.tokenKey)

export const getActiveThemeName = () => Cookies.get(Keys.activeThemeName)
export const setActiveThemeName = (themeName: string) => { Cookies.set(Keys.activeThemeName, themeName) }

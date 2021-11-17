<!--
 * @Description: 权限测试
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 10:06:42
 * @LastEditTime: 2021-11-08 14:55:53
 * @LastEditors: lichengcheng
-->
<!-- 权限测试（页面权限、指令权限、角色权限）Demo，勿删 -->

<template>
  <div class="app-container">
    <SwitchRoles @change="handleRolesChange" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleRolesChange = () => {
  router.push({ path: '/401' }).catch((err) => {
    console.warn(err)
  })
}
</script>

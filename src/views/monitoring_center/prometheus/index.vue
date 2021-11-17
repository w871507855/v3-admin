<!--
 * @Description: prometheus页面
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-15 17:46:18
 * @LastEditTime: 2021-11-17 19:02:44
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <div>
      <el-input v-model="server.server_ip" placeholder="请输入监控服务器ip">
        promethheus服务器
      </el-input>
      <el-button type="primary" @click="getTargets">
        查询
      </el-button>
    </div>
    <div>
      <el-table :data="serverList" :row-class-name="tableRowClassName" @row-click="toGrafana">
        <el-table-column label="监控接口地址" prop="labels.instance" />
        <el-table-column label="主机名称" prop="labels.hostname" />
        <el-table-column label="工作组" prop="labels.job" />
        <el-table-column label="分组" prop="labels.group" />
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { getProServers } from '@/api/monitoring_center/prometheus'
export default defineComponent({
  setup() {
    const state = reactive({
      server: {
        server_ip: ''
      },
      serverList: []
    })
    const methods = reactive({
      getTargets: () => {
        getProServers(state.server).then((res: any) => {
          state.serverList = res.data.activeTargets
        })
      },
      tableRowClassName: (row: any) => {
        if (row.row.health === 'down') {
          return 'warning-row'
        } else {
          return 'success-row'
        }
      },
      toGrafana: (row: any) => {
        if (row.labels.job === 'linux-server') {
          const url = `http://172.21.5.200:3000/d/9CWBz0bik/linux-serverjian-kong?orgId=1&var-job=${row.labels.job}&var-hostname=All&var-node=${row.labels.instance}&var-device=All&var-origin_prometheus=`
          window.open(url, '_blank')
        }
      }
    })
    // onMounted(() => {
    // })
    return {
      ...toRefs(state),
      ...toRefs(methods)
    }
  }
})
</script>

<style>
.el-table .warning-row {
  --el-table-tr-background-color: var(--el-color-warning-lighter);
}
.el-table .success-row {
  --el-table-tr-background-color: var(--el-color-success-lighter);
}
</style>

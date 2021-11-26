<!--
 * @Description: 报警页面
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-15 17:46:51
 * @LastEditTime: 2021-11-18 17:08:56
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <el-table :data="alarmList">
      <el-table-column label="开始时间" prop="activeAt" />
      <el-table-column label="节点名称" prop="labels.instance" />
      <el-table-column label="报警内容" prop="annotations.description" />
    </el-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getAlarm } from '@/api/monitoring_center/alarm'
export default defineComponent({
  setup() {
    const state = reactive({
      alarmList: []
    })
    const methods = reactive({
      getAlarmList: () => {
        getAlarm().then((res: any) => {
          console.log(res)
          if (res?.code === 200) {
            state.alarmList = res?.data.alerts
          }
        })
      }
    })
    onMounted(() => {
      methods.getAlarmList()
    })
    return {
      ...toRefs(state),
      ...toRefs(methods)
    }
  }
})
</script>

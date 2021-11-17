<!--
 * @Description: 自定义任务
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-09 13:46:11
 * @LastEditTime: 2021-11-11 18:37:01
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <div>
      <el-select v-model="serverId" @change="checkServer" placeholder="请选择服务器">
        <el-pagination
          v-model:currentPage="severSearch.page"
          :page-size="severSearch.pageSize"
          layout="total, prev, pager, next"
          :total="severSearch.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <el-option
          v-for="item in serverList"
          :key="item.id"
          :label="item.server_ip"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" @click="addJob">
        添加定时任务
      </el-button>
    </div>
    <div>
      <el-table :data="taskList">
        <el-table-column label="任务名称" prop="name" />
        <el-table-column label="任务执行时间(分钟)" prop="minute" />
        <el-table-column label="任务执行时间(小时)" prop="hour" />
        <el-table-column label="任务执行时间(日期)" prop="day" />
        <el-table-column label="任务执行时间(月份)" prop="month" />
        <el-table-column label="任务执行时间(星期)" prop="weekday" />
        <el-table-column label="任务内容" prop="job" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="updateJob(scope.$index, scope.row)">
              更新
            </el-button>
            <el-button type="danger" size="mini" @click="deleteJob(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="添加定时任务" v-model="dialogAdd">
        <el-form :model="taskGreat">
          <el-form-item label="服务器">
            {{ taskGreat.server }}
          </el-form-item>
          <el-form-item label="任务名称">
            <el-input v-model="taskGreat.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="任务执行时间(分钟)">
            <el-input v-model="taskGreat.minute" placeholder="请输入分钟" />
          </el-form-item>
          <el-form-item label="任务执行时间(小时)">
            <el-input v-model="taskGreat.hour" placeholder="请输入小时" />
          </el-form-item>
          <el-form-item label="任务执行时间(日期)">
            <el-input v-model="taskGreat.day" placeholder="请输入日期" />
          </el-form-item>
          <el-form-item label="任务执行时间(月份)">
            <el-input v-model="taskGreat.month" placeholder="请输入月份" />
          </el-form-item>
          <el-form-item label="任务执行时间(星期)">
            <el-input v-model="taskGreat.weekday" placeholder="请输入星期" />
          </el-form-item>
          <el-form-item label="任务内容">
            <el-input v-model="taskGreat.job" placeholder="请输入任务内容" />
          </el-form-item>
          <el-button type="primary" @click="creaetTask">
            提交
          </el-button>
          <el-button type="danger" @click="deleteTask">
            清空
          </el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="更新定时任务" v-model="dialogUpdate">
        <el-form :model="taskUpdate">
          <el-form-item label="服务器">
            {{ taskUpdate.server }}
          </el-form-item>
          <el-form-item label="任务名称">
            <el-input v-model="taskUpdate.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="任务执行时间(分钟)">
            <el-input v-model="taskUpdate.minute" placeholder="请输入分钟" />
          </el-form-item>
          <el-form-item label="任务执行时间(小时)">
            <el-input v-model="taskUpdate.hour" placeholder="请输入小时" />
          </el-form-item>
          <el-form-item label="任务执行时间(日期)">
            <el-input v-model="taskUpdate.day" placeholder="请输入日期" />
          </el-form-item>
          <el-form-item label="任务执行时间(月份)">
            <el-input v-model="taskUpdate.month" placeholder="请输入月份" />
          </el-form-item>
          <el-form-item label="任务执行时间(星期)">
            <el-input v-model="taskUpdate.weekday" placeholder="请输入星期" />
          </el-form-item>
          <el-form-item label="任务内容">
            <el-input v-model="taskUpdate.job" placeholder="请输入任务内容" />
          </el-form-item>
          <el-button type="primary" @click="updateTask">
            提交
          </el-button>
          <el-button type="danger">
            清空
          </el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getAllServer, getServer } from '@/api/server_management/server'
import { getAllTimingApi, createTimingTask, updateTimingTask, deleteTimingTask } from '@/api/task_center/timing_task'
import { ElMessage } from 'element-plus'
export default defineComponent({
  setup() {
    const state = reactive({
      serverId: 0,
      server: '',
      severSearch: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      serverList: [],
      taskList: [],
      taskGreat: {
        name: '',
        minute: '*',
        hour: '*',
        day: '*',
        month: '*',
        weekday: '*',
        job: '',
        server: ''
      },
      taskUpdate: {
        name: '',
        minute: '*',
        hour: '*',
        day: '*',
        month: '*',
        weekday: '*',
        job: '',
        server: ''
      },
      taskDelete: {
        server: '',
        name: ''
      },
      dialogAdd: false,
      dialogUpdate: false
    })
    const methods = reactive({
      // 切换分页展示数
      handleSizeChange: (val: number) => {
        state.severSearch.pageSize = val
        methods.getAll()
      },
      // 切换分页
      handleCurrentChange: (val: number) => {
        state.severSearch.page = val
        methods.getAll()
      },
      // 分页获取服务器
      getAll: () => {
        getAllServer(state.severSearch).then((res: any) => {
          if (res?.code === 200) {
            state.severSearch.total = res?.data.total
            state.serverList = res?.data.dataList
          }
        })
      },
      // 根据id查询服务器信息
      getServerInfo: () => {
        getServer(state.serverId).then((res: any) => {
          if (res?.code === 200) {
            state.server = res?.data.server_ip
            state.taskGreat.server = res?.data.server_ip
            state.taskUpdate.server = res?.data.server_ip
            state.taskDelete.server = res?.data.server_ip
            methods.getAllTiming()
          }
        })
      },
      getAllTiming: () => {
        console.log('sd', state.server)
        getAllTimingApi({ server: state.server }).then((res: any) => {
          if (res?.code === 200) {
            state.taskList = res?.data
          }
        })
      },
      // 选择服务器触发事件
      checkServer: () => {
        methods.getServerInfo()
      },
      // 添加按钮触发事件
      addJob: () => {
        state.dialogAdd = true
      },
      // 添加定时任务
      creaetTask: () => {
        createTimingTask(state.taskGreat).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: res?.message,
              type: 'success'
            })
            state.dialogAdd = false
            methods.getAllTiming()
          }
        })
      },
      // 更新按钮触发事件
      updateJob: (index: any, row: any) => {
        state.dialogUpdate = true
        state.taskUpdate = row
        state.taskUpdate.server = state.server
      },
      // 提交更新任务
      updateTask: () => {
        console.log(state.taskUpdate)
        state.taskUpdate.server = state.server
        updateTimingTask(state.taskUpdate).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: res?.message,
              type: 'success'
            })
            state.dialogUpdate = false
            methods.getAllTiming()
          }
        })
      },
      // 删除任务
      deleteJob: (index: any, row: any) => {
        state.taskDelete.server = state.server
        state.taskDelete.name = row.name
        deleteTimingTask(state.taskDelete).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: res?.message,
              type: 'success'
            })
            methods.getAllTiming()
          }
        })
      }
    })
    onMounted(() => {
      methods.getAll()
    })
    return {
      ...toRefs(state),
      ...toRefs(methods)
    }
  }
})
</script>

<!--
 * @Description: 计划任务
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-09 13:45:56
 * @LastEditTime: 2021-11-25 15:01:32
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <div>
      <el-button type="primary" @click="taskToshell">
        命令行任务
      </el-button>
      <el-button type="primary" @click="taskToscript">
        脚本任务
      </el-button>
    </div>
    <div>
      <el-descriptions
        title="任务执行结果"
        direction="vertical"
        :column="4"
        border
        style="margin-top: 100px"
      >
        <el-descriptions-item label="服务器">
          {{ result.server_ip }}
        </el-descriptions-item>
        <el-descriptions-item label="执行情况">
          {{ result.case }}
        </el-descriptions-item>
        <el-descriptions-item label="正确输出">
          {{ result.stdout }}
        </el-descriptions-item>
        <el-descriptions-item label="错误输出">
          {{ result.stderr }}
        </el-descriptions-item>
        >
      </el-descriptions>
    </div>
    <div>
      <el-dialog title="命令行任务" v-model="dialogShell">
        <el-form>
          <el-form-item
            label="服务器"
          >
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
                :label="item.hostname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="shell命令">
            <el-input v-model="jobInfoShell.script" placeholder="请输入shell命令" />
          </el-form-item>
          <el-form-item style="margin-top: 150px">
            <el-button type="primary" @click="toShell">
              确认执行
            </el-button>
            <el-button>
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="脚本任务" v-model="dialogScript">
        <el-form>
          <el-form-item
            label="服务器"
          >
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
                :label="item.hostname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工作目录">
            <el-input v-model="jobInfoScript.chdir" placeholder="请输入工作目录" />
          </el-form-item>
          <el-form-item label="脚本目录">
            <el-input v-model="jobInfoScript.script_dir" placeholder="请输入脚本目录" />
          </el-form-item>
          <el-form-item style="margin-top: 150px">
            <el-button type="primary" @click="toScript">
              确认执行
            </el-button>
            <el-button>
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getAllServer, getServer } from '@/api/server_management/server'
import { taskShellApi, taskScriptApi } from '@/api/task_center/job_task'
export default defineComponent({
  setup() {
    const state = reactive({
      serverId: 0,
      jobInfoShell: {
        server: '',
        script: '',
        group: ''
      },
      jobInfoScript: {
        chdir: '',
        script_dir: '',
        server: '',
        group: ''
      },
      severSearch: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      serverList: [],
      dialogShell: false,
      dialogScript: false,
      result: {
        server_ip: '',
        case: '',
        stdout: '',
        stderr: ''
      }
    })
    const methods = reactive({
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
            state.jobInfoShell.server = res?.data.hostname
            state.jobInfoShell.group = res?.data.group.group
            state.jobInfoScript.server = res?.data.hostname
            state.jobInfoScript.group = res?.data.group.group
          }
        })
      },
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
      // 点击命令行任务对话框
      taskToshell: () => {
        state.dialogShell = true
      },
      // 点击命令行任务对话框
      taskToscript: () => {
        console.log('打开弹窗')
        state.dialogScript = true
      },
      // 选择服务器触发事件
      checkServer: () => {
        methods.getServerInfo()
      },
      // 提交shell任务
      toShell: () => {
        // console.log(state.jobInfoShell.server)
        taskShellApi(state.jobInfoShell).then((res: any) => {
          if (res?.data.stderr.length === 0) {
            state.result.server_ip = state.jobInfoShell.server
            state.result.case = '执行成功'
            state.result.stdout = res?.data.stdout
            state.result.stderr = res?.data.stderr
          } else {
            state.result.server_ip = state.jobInfoShell.server
            state.result.case = '执行失败'
            state.result.stdout = res?.data.stdout
            state.result.stderr = res?.data.stderr
          }
          state.dialogShell = false
        })
      },
      // 提交script任务
      toScript: () => {
        taskScriptApi(state.jobInfoScript).then((res: any) => {
          if (!res?.data.msg) {
            state.result.server_ip = state.jobInfoScript.server
            state.result.case = '执行成功'
            state.result.stdout = res?.data.stdout
            state.result.stderr = ''
          } else {
            state.result.server_ip = state.jobInfoScript.server
            state.result.case = '执行失败'
            state.result.stdout = ''
            state.result.stderr = res?.data.msg
          }
          state.dialogScript = false
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

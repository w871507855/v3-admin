<!--
 * @Description: 服务器信息页面
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 13:51:46
 * @LastEditTime: 2021-11-26 14:33:20
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <el-button
      type="primary"
      @click="dialogCreateServer = true"
    >
      新增服务器
    </el-button>
    <el-table
      :data="serverList"
      style="width: 100%"
    >
      <el-table-column
        label="服务器名称"
        prop="hostname"
      />
      <el-table-column
        label="ip地址"
        prop="server_ip"
      />
      <el-table-column
        label="登录用户"
        prop="server_user"
      />
      <el-table-column
        label="登录端口"
        prop="server_port"
      />
      <el-table-column
        label="所属分组"
        prop="group.description"
      />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="mini"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <el-button
            size="mini"
            type="success"
            @click="handlerServerSSH(scope.$index, scope.row)"
          >
            webssh
          </el-button>
          <el-button
            size="mini"
            type="info"
            @click="handlerServerInfo(scope.$index, scope.row)"
          >
            获取硬件信息
          </el-button>
          <!-- <el-button
            size="mini"
            @click="serverToGroup(scope.$index, scope.row)"
          >
            添加分组
          </el-button> -->
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            更新服务器
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除服务器
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:currentPage="serverSearch.page"
        :page-sizes="[10, 20, 30, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="serverSearch.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加服务器弹窗 -->
    <el-dialog
      v-model="dialogCreateServer"
      title="服务器管理"
    >
      <el-form>
        <el-form-item label="服务器名称">
          <el-input
            v-model="serverCreate.hostname"
            placeholder="请输入服务器名称"
          />
        </el-form-item>
        <el-form-item label="服务器地址">
          <el-input
            v-model="serverCreate.ip"
            placeholder="请输入IP地址"
          />
        </el-form-item>
        <el-form-item label="服务器账号">
          <el-input
            v-model="serverCreate.user"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="服务器密码">
          <el-input
            v-model="serverCreate.passwd"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="服务器登录端口">
          <el-input
            v-model="serverCreate.port"
            placeholder="请输入端口"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="create"
          >
            确认
          </el-button>
          <el-button type="danger" @click="clearServerCreate">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 更新服务器弹窗 -->
    <el-dialog
      v-model="dialogUpdateServer"
      title="更新服务器"
    >
      <el-form>
        <el-form-item label="id">
          <el-input
            v-model="serverUpdate.id"
            disabled
            placeholder="id"
          />
        </el-form-item>
        <el-form-item label="服务器名称">
          <el-input
            v-model="serverUpdate.hostname"
            placeholder="请输入服务器名称"
          />
        </el-form-item>
        <el-form-item label="服务器地址">
          <el-input
            v-model="serverUpdate.ip"
            placeholder="请输入IP地址"
          />
        </el-form-item>
        <el-form-item label="服务器账号">
          <el-input
            v-model="serverUpdate.user"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="服务器密码">
          <el-input
            v-model="serverUpdate.passwd"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="服务器登录端口">
          <el-input
            v-model="serverUpdate.port"
            placeholder="请输入端口"
          />
        </el-form-item>
        <el-form-item label="选择服务器所属资源组">
          <el-select v-model="serverUpdate.group_id" placeholder="选择资源组">
            <el-pagination
              v-model:currentPage="groupSearch.page"
              :page-size="groupSearch.pageSize"
              layout="total, prev, pager, next"
              :total="groupSearch.total"
              @size-change="handleGroupSizeChange"
              @current-change="handleGroupCurrentChange"
            />
            <el-option v-for="item in groupList" :key="item.id" :label="item.group" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="update"
          >
            确认
          </el-button>
          <el-button type="danger" @click="clearServerUpdate">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 展示服务器硬件信息 -->
    <el-dialog
      v-model="dialogServerInfo"
      title="服务器硬件信息"
    >
      <el-descriptions
        title="服务器硬件信息"
        direction="vertical"
        :colum="10"
        border
      >
        <el-descriptions-item label="主机名">
          {{ serverInfo.hostnamne }}
        </el-descriptions-item>
        <el-descriptions-item label="系统版本">
          {{ serverInfo.distribution_version }}
        </el-descriptions-item>
        <el-descriptions-item label="内核版本">
          {{ serverInfo.kernel }}
        </el-descriptions-item>
        <el-descriptions-item label="系统位数">
          {{ serverInfo.userspace_bits }}
        </el-descriptions-item>
        <el-descriptions-item label="网卡">
          {{ serverInfo.network_card }}
        </el-descriptions-item>
        <el-descriptions-item label="ipv4地址">
          {{ serverInfo.ipv4 }}
        </el-descriptions-item>
        <el-descriptions-item label="总内存">
          {{ serverInfo.memory_mb }}
        </el-descriptions-item>
        <el-descriptions-item label="空闲内存">
          {{ serverInfo.memfree_mb }}
        </el-descriptions-item>
        <el-descriptions-item label="cpu核数">
          {{ serverInfo.processor_vcpus }}
        </el-descriptions-item>
        <el-descriptions-item label="cpu型号">
          {{ serverInfo.processor }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getAllServer, createServer, updateServer, getServer, deleteServer, getServerInfo } from '@/api/server_management/server'
import { getAllGroup } from '@/api/server_management/group'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  setup() {
    const state = reactive({
      serverCreate: {
        hostname: '',
        ip: '',
        user: '',
        passwd: '',
        port: 22,
        group_id: 1
      },
      serverUpdate: {
        id: 0,
        hostname: '',
        ip: '',
        user: '',
        passwd: '',
        port: 22,
        group_id: 1
      },
      serverSearch: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      serverList: [],
      groupSearch: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      groupList: [],
      serverGroup: {
        server_id: '',
        group_id: ''
      },
      dialogCreateServer: false,
      dialogUpdateServer: false,
      dialogServerInfo: false,
      serverInfo: {},
      passwd_base64: '',
      routeData: ''
    })
    const methods = reactive({
      // 分页查询
      getAll: () => {
        getAllServer(state.serverSearch).then((res: any) => {
          if (res?.code === 200) {
            state.serverList = res?.data.dataList
            state.serverSearch.total = res?.data.total
          }
        })
      },
      // 新建服务器
      create: () => {
        createServer(state.serverCreate).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: res?.message,
              type: 'success'
            })
            methods.getAll()
            state.dialogCreateServer = false
          } else {
            ElMessage({
              message: res?.message,
              type: 'warning'
            })
          }
        })
      },
      clearServerCreate: () => {
        state.serverCreate.hostname = ''
        state.serverCreate.ip = ''
        state.serverCreate.user = ''
        state.serverCreate.passwd = ''
        state.serverCreate.port = 22
        state.serverCreate.group_id = 1
      },
      handleEdit: (index: any, row: any) => {
        state.dialogUpdateServer = true
        methods.get(row.id)
        methods.groupAll()
      },
      // 更新服务器
      update: () => {
        updateServer(state.serverUpdate).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: res?.message,
              type: 'success'
            })
            methods.getAll()
            state.dialogUpdateServer = false
          } else {
            ElMessage({
              message: res?.message,
              type: 'warning'
            })
          }
        })
      },
      clearServerUpdate: () => {
        methods.get(state.serverUpdate.id)
      },
      // 根据id查询服务器
      get: (id: number) => {
        getServer(id).then((res: any) => {
          if (res?.code === 200) {
            state.serverUpdate.id = res?.data.id
            state.serverUpdate.hostname = res?.data.hostname
            state.serverUpdate.ip = res?.data.server_ip
            state.serverUpdate.user = res?.data.server_user
            state.serverUpdate.passwd = res?.data.server_passwd
            state.serverUpdate.port = res?.data.server_port
            state.serverUpdate.group_id = res?.data.group_id
          } else {
            ElMessage({
              message: res?.message,
              type: 'warning'
            })
          }
        })
      },
      // 删除服务器
      handleDelete: (index: any, row: any) => {
        ElMessageBox.confirm(
          '确定要删除该服务器',
          'Warning',
          {
            confirmButtonText: '确定',
            confirmButtonClass: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteServer(row.id).then((res: any) => {
            if (res?.code === 200) {
              ElMessage({
                message: res?.message,
                type: 'success'
              })
              methods.getAll()
            }
          })
        }).catch(() => {
          ElMessage({
            message: '取消删除',
            type: 'success'
          })
        })
      },
      // 查询服务器硬件信息
      handlerServerInfo: (index: any, row: any) => {
        getServerInfo(row.id).then((res: any) => {
          if (res.code === 200) {
            state.dialogServerInfo = true
            state.serverInfo = res.data
            ElMessage({
              message: res.message,
              type: 'success'
            })
          } else {
            ElMessage({
              message: res.message,
              type: 'warning'
            })
          }
        })
      },
      // 分页切换
      handleSizeChange: (val: any) => {
        state.serverSearch.pageSize = val
        methods.getAll()
      },
      // 分页数量修改
      handleCurrentChange: (val: any) => {
        state.serverSearch.page = val
        methods.getAll()
      },
      // 分页查询分组
      groupAll: () => {
        getAllGroup(state.groupSearch).then((res: any) => {
          if (res?.code === 200) {
            state.groupList = res?.data.dataList
            state.groupSearch.total = res?.data.total
          }
        })
      },
      // 资源组切换分页
      handleGroupSizeChange: (val: any) => {
        state.groupSearch.pageSize = val
        methods.groupAll()
      },
      // 资源组分页数量修改
      handleGroupCurrentChange: (val: any) => {
        state.groupSearch.page = val
        methods.groupAll()
      },
      // 服务器远程ssh
      handlerServerSSH: (index: any, row: any) => {
        state.passwd_base64 = window.btoa(row.server_passwd)
        const url = `http://172.21.5.200:8888/?hostname=${row.server_ip}&username=${row.server_user}&password=${state.passwd_base64}&port=${row.server_port}`
        window.open(url, '_blank')
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

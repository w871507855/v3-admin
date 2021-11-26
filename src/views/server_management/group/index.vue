<!--
 * @Description: 资源组页面
 * @Author: lichengcheng
 * @mail: 871507855@qq.com
 * @Date: 2021-11-08 13:52:00
 * @LastEditTime: 2021-11-26 14:47:34
 * @LastEditors: lichengcheng
-->
<template>
  <div>
    <el-button
      type="primary"
      @click="dialogAddGroup = true"
    >
      新增分组
    </el-button>
    <el-table
      :data="groupList"
      style="width: 100%"
    >
      <el-table-column
        label="资源组名称"
        prop="group"
      />
      <el-table-column
        label="组说明"
        prop="description"
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
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:currentPage="currentPage4"
        :page-sizes="[10, 20, 30, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="groupSearch.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加分组弹窗 -->
    <el-dialog
      v-model="dialogAddGroup"
      title="分组管理"
    >
      <el-form :model="groupCreate">
        <el-form-item label="组名">
          <el-input
            v-model="groupCreate.group"
            placeholder="请输入组名"
          />
        </el-form-item>
        <el-form-item label="组备注">
          <el-input
            v-model="groupCreate.description"
            placeholder="请输入备组"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="create"
          >
            确认
          </el-button>
          <el-button type="danger" @click="clearGroupCreate">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 更新分组弹窗 -->
    <el-dialog
      v-model="dialogUpdateGroup"
      title="分组更新"
    >
      <el-form :model="groupUpdate">
        <el-form-item label="组名">
          <el-input
            v-model="groupUpdate.group"
            placeholder="请输入组名"
          />
        </el-form-item>
        <el-form-item label="组备注">
          <el-input
            v-model="groupUpdate.description"
            placeholder="请输入备组"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="update"
          >
            确认
          </el-button>
          <el-button type="danger" @click="clearGroupUpdate">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { getAllGroup, createGroup, updateGroup, deleteGroup, getGroup } from '@/api/server_management/group'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  setup() {
    const state = reactive({
      groupCreate: {
        group: '',
        description: ''
      },
      groupUpdate: {
        id: 0,
        group: '',
        description: ''
      },
      groupSearch: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      groupList: [],
      dialogAddGroup: false,
      dialogUpdateGroup: false
    })
    const methods = reactive({
      // 分页查询
      getAll: () => {
        getAllGroup(state.groupSearch).then((res: any) => {
          state.groupSearch.total = res?.data.total
          state.groupList = res?.data.dataList
        })
      },
      // 创建资源组
      create: () => {
        createGroup(state.groupCreate).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: '资源分组创建成功',
              type: 'success'
            })
            methods.getAll()
            state.dialogAddGroup = false
          }
        })
      },
      clearGroupCreate: () => {
        state.groupCreate.group = ''
        state.groupCreate.description = ''
      },
      // 更新资源组弹窗
      handleEdit: (index: any, row: any) => {
        // state.groupUpdate.id = row.id
        // state.groupUpdate.group = row.group
        // state.groupUpdate.description = row.description
        methods.get(row.id)
        state.dialogUpdateGroup = true
      },
      // 更新资源组信息
      update: () => {
        updateGroup(state.groupUpdate).then((res: any) => {
          if (res?.code === 200) {
            ElMessage({
              message: '资源组更新成功',
              type: 'success'
            })
            methods.getAll()
            state.dialogUpdateGroup = false
          }
        })
      },
      clearGroupUpdate: () => {
        methods.get(state.groupUpdate.id)
      },
      // 根据id查询资源组信息
      get: (id: number) => {
        getGroup(id).then((res: any) => {
          if (res?.code === 200) {
            state.groupUpdate.id = res?.data.id
            state.groupUpdate.group = res?.data.group
            state.groupUpdate.description = res?.data.description
          }
        })
      },
      // 删除资源组信息
      handleDelete: (index: any, row: any) => {
        ElMessageBox.confirm(
          '确定要删除该资源组',
          'Warning',
          {
            confirmButtonText: '确定',
            confirmButtonClass: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteGroup(row.id).then((res: any) => {
            if (res?.code === 200) {
              ElMessage({
                message: '资源组删除成功',
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
      // 分页切换
      handleSizeChange: (val: any) => {
        state.groupSearch.pageSize = val
        methods.getAll()
      },
      // 分页数量修改
      handleCurrentChange: (val: any) => {
        state.groupSearch.page = val
        methods.getAll()
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

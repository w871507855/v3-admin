import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

// 常驻路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }
]

// 动态路由
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    redirect: '/permission/page',
    meta: {
      title: '权限测试页',
      icon: 'lock',
      roles: ['admin', 'editor'], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: 'page',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: '页面权限',
          roles: ['admin'] // 或者在子导航中设置角色
        }
      },
      {
        path: 'directive',
        component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: '指令权限' // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: '/serverManagement',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '服务器资源管理',
      icon: 'server_management'
    },
    children: [
      {
        path: 'companyServer',
        component: () => import(/* webpackChunkName: "server" */ '@/views/server_management/server/index.vue'),
        name: 'CompanyServer',
        meta: { title: '服务器管理', noCache: true, icon: 'server' }
      },
      {
        path: 'group',
        component: () => import(/* webpackChunkName: "server" */ '@/views/server_management/group/index.vue'),
        name: 'Group',
        meta: { title: '资源组管理', noCache: true, icon: 'group' }
      }
    ]
  },
  {
    path: '/task_center',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '任务中心',
      icon: 'taskCenter'
    },
    children: [
      {
        path: 'job_task',
        component: () => import(/* webpackChunkName: "task" */ '@/views/task_center/job_task/index.vue'),
        name: 'job_task',
        meta: { title: '自定义任务', noCache: true, icon: 'job' }
      },
      {
        path: 'timing_task',
        component: () => import(/* webpackChunkName: "task" */ '@/views/task_center/timing_task/index.vue'),
        name: 'timing_task',
        meta: { title: '定时任务', noCache: true, icon: 'timing' }
      },
      {
        path: 'code_release',
        component: () => import(/* webpackChunkName: "task" */ '@/views/task_center/code_release/index.vue'),
        name: 'code_release',
        meta: { title: '代码发布', noCache: true, icon: 'code' }
      }
    ]
  },
  {
    path: '/monitoring_center',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '监控中心',
      icon: 'monitoring'
    },
    children: [
      {
        path: 'prometheus',
        component: () => import(/* webpackChunkName: "monitoring" */ '@/views/monitoring_center/prometheus/index.vue'),
        name: 'prometheus',
        meta: { title: 'prometheus', noCache: true, icon: 'prometheus' }
      },
      {
        path: 'alarm',
        component: () => import(/* webpackChunkName: "monitoring" */ '@/views/monitoring_center/alarm/index.vue'),
        name: 'alarm',
        meta: { title: '报警', noCache: true, icon: 'alarm' }
      }
    ]
  },
  { // 必须将 'Error' 路由放在最后 Must put the 'Error' route at the end
    path: '/:pathMatch(.*)*',
    component: Layout,
    name: 'Error',
    redirect: '/404',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: '401',
        meta: {
          title: '401',
          hidden: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: '404',
        meta: {
          title: '404',
          hidden: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export function resetRouter() {
  // 重置路由
  // 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器，不过体验不是很好
    window.location.reload()
  }
}

export default router

import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/components/layout.vue";
import ChildLayout from "@/components/childLayout.vue";
const routes = [
  {
    path: "/",
    name: "首页",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "工作台",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
        meta: {
          icon: "el-icon-guide"
        }
      },
      {
        path: "/pushCenter",
        name: "一键推送",
        component: () =>
          import(
            /* webpackChunkName: "pushCenter" */ "../views/pushCenter.vue"
          ),
        meta: {
          icon: "el-icon-guide"
        }
      },
      {
        path: "oppo",
        name: "OPPO推送中心",
        component: ChildLayout,
        children: [
          {
            path: "/oppo/notification",
            name: "OPPO(欢太)-消息栏通知",
            component: () =>
              import(
                /* webpackChunkName: "oppo" */ "../views/oppo/notification.vue"
              )
          },
          {
            path: "/oppo/draft",
            name: "OPPO-草稿箱",
            component: () =>
              import(/* webpackChunkName: "oppo" */ "../views/oppo/draft.vue")
          }
        ],
        meta: {
          icon: "el-icon-guide"
        }
      },
      {
        path: "huawei",
        name: "华为推送中心",
        component: ChildLayout,
        children: [
          {
            path: "/huawei/notification",
            name: "华为-消息栏通知",
            component: () =>
              import(
                /* webpackChunkName: "huawei" */ "../views/huawei/notification.vue"
              )
          }
        ],
        meta: {
          icon: "el-icon-guide"
        }
      },
      {
        path: "xiaomi",
        name: "xiaomi推送中心",
        component: ChildLayout,
        children: [
          {
            path: "/xiaomi/notification",
            name: "xiaomi通知栏消息",
            component: () =>
              import(
                /* webpackChunkName: "xiaomi" */ "../views/xiaomi/notification.vue"
              )
          },
          {
            path: "/xiaomi/statics",
            name: "xiaomi消息统计",
            component: () =>
              import(
                /* webpackChunkName: "xiaomi" */ "../views/xiaomi/statics.vue"
              )
          }
        ],
        meta: {
          icon: "el-icon-guide"
        }
      },
      {
        path: "vivo",
        name: "vivo推送中心",
        component: ChildLayout,
        children: [
          {
            path: "/vivo/notification",
            name: "通知栏消息",
            component: () =>
              import(
                /* webpackChunkName: "vivo" */ "../views/vivo/notification.vue"
              )
          },
          {
            path: "/vivo/statics",
            name: "消息统计",
            component: () =>
              import(/* webpackChunkName: "vivo" */ "../views/vivo/statics.vue")
          }
        ],
        meta: {
          icon: "el-icon-guide"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue")
  }
  // {
  //   path: "/:pathMatch(.*)",
  //   name: "404",
  //   component: () =>
  //     import(/* webpackChunkName: "404" */ "../views/404.vue")
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

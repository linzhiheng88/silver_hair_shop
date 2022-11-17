import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'view-design';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    meta: {
      requiresAuth:false,
      keepAlive: false,
      notShowMenu:true,
      view: 'full',
    },
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/index',
    name: 'Index',
    meta: {
      title: '数据统计',
      icon:'md-analytics',
      requiresAuth:false,
      keepAlive: false,
      weapp:true,
    },
    component: () => import('../views/index/index.vue'),
  },
  // {
  //   path: '/bill',
  //   name: 'Bill',
  //   meta: {
  //     title: '账单',
  //     icon:'ios-list-box',
  //     requiresAuth:false,
  //     keepAlive: true,
  //     weapp:true,
  //   },
  //   component: () => import('../views/bill/index.vue'),
  // },
  {
    path: '/bill',
    name: 'Bill',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '账单管理',
      icon: 'ios-list-box',
      permissions: 1,
      keepAlive: true,
      weapp:true,
      shop:true
    },
    children: [
      {
        path: 'weapp',
        name: 'WeappBill',
        meta: {
          title: '平台账单',
          icon: 'ios-apps-outline',
          permissions: 1,
          keepAlive: true,
          weapp: true
        },
        component: () => import('../views/bill/index.vue'),
      },
      {
        path: 'shop',
        name: 'ShopBill',
        meta: {
          title: '商户账单',
          icon: 'ios-apps-outline',
          permissions: 1,
          keepAlive: true,
          weapp: true,
          shop:true
        },
        component: () => import('../views/bill/shop.vue'),
      },
    ]
  },
  {
    path: '/good',
    name: 'Good',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '商品管理',
      icon:'md-basket',
      permissions: 1,
      keepAlive: true,
      weapp:true
    },
    children: [
      {
        path: 'class',
        name: 'class',
        meta: {
          title: '商品分类',
          icon:'ios-apps-outline',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/class/class.vue'),
      },
      {
        path: 'good',
        name: 'good',
        meta: {
          title: '普通商品',
          permissions: 1,
          keepAlive: true,
          weapp:true
        },
        component: () => import('../views/good/index.vue'),
      },
      {
        path: 'secondsKill',
        name: 'secondsKill',
        meta: {
          title: '秒杀专区',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/good/secondsKill.vue'),
      },
      {
        path: 'secondsKill/secondsKillGood/:secondsKillId',
        name: 'secondsKillGood',
        meta: {
          title: '',
          permissions: 1,
          keepAlive: false,
          notShowMenu:true
        },
        component: () => import('../views/good/secondsKillGood.vue'),
      },

      // {
      //   path: 'colorGood',
      //   name: 'colorGood',
      //   meta: {
      //     title: '彩页商品',
      //     permissions: 1,
      //     keepAlive: true,
      //   },
      //   component: () => import('../views/good/colorGood.vue'),
      // },
      {
        path: 'add',
        name: 'good-add',
        meta: {
          title: '',
          permissions: 1,
          keepAlive: false,
          notShowMenu: true,
          weapp:true
        },
        component: () => import('../views/good/add.vue'),
      },

      {
        path: 'newZone',
        name: 'newZone',
        meta: {
          title: '新人专区',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/good/newZone.vue'),
      },

      {
        path: 'comments',
        name: 'comments',
        meta: {
          title: '商品评价',
          permissions: 1,
          keepAlive: false,
        },
        component: () => import('../views/comments/index.vue'),
      },
    ]
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '活动管理',
      icon:'ios-flower',
      permissions: 1,
      keepAlive: true
    },
    children: [
      {

        path: 'activity',
        name: 'activity',
        meta: {
          title: '活动列表',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/activity/index.vue'),
      },
      {
        path: 'activityClass',
        name: 'activityClass',
        meta: {
          title: '推荐分类',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/activity/class.vue'),
      },
      {
        path: 'theme',
        name: 'theme',
        meta: {
          title: '推荐列表',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/activity/theme.vue'),
      },
      {
        path: 'activity/good/:activity_id',
        name: 'activityGood',
        meta: {
          title: '',
          permissions: 1,
          keepAlive: false,
          notShowMenu: true
        },
        component: () => import('../views/activity/good.vue'),
      },
      {
        path: 'activity/box/:activity_id',
        name: 'activityBox',
        meta: {
          title: '',
          permissions: 1,
          keepAlive: false,
          notShowMenu: true
        },
        component: () => import('../views/activity/box.vue'),
      },
    ]
  },

  {
    path: '/epShop',
    name: 'EpShop',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: 'EP平台管理',
      icon:'ios-archive',

      keepAlive: true,
      weapp:true,
    },
    children: [
      {
        path: 'hostList',
        name: 'hostList',
        meta: {
          title: '阿里巴巴选品',
          permissions: 1,
          keepAlive: true,
          weapp:true,
        },
        component: () => import('../views/ep/hostList.vue'),
      },
      {
        path: 'goodDetail/:id',
        name: 'goodDetail',
        meta: {
          title: '阿里巴巴商品详情',
          permissions: 1,
          notShowMenu: true,
          keepAlive: false,
          weapp:true,
        },
        component: () => import('../views/ep/goodDetail.vue'),
      },
      {
        path: 'offerSearch',
        name: 'offerSearch',
        meta: {
          title: '阿里搜索结果',
          permissions: 1,
          notShowMenu: true,
          keepAlive: true,
          weapp:true,
        },
        component: () => import('../views/ep/offerSearch.vue'),
      },

      {
        path: 'alibabaOrder',
        name: 'alibabaOrder',
        meta: {
          title: '阿里巴巴订单',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/ep/alibabaOrder.vue'),
      },
      {
        path: 'alibabaGood/:group_id',
        name: 'alibabaGood',
        meta: {
          title: '',
          permissions: 1,
          keepAlive: false,
          notShowMenu: true
        },
        component: () => import('../views/ep/alibabaGood.vue'),
      },

      {
        path: 'alibabaShopBlacklist',
        name: 'alibabaShopBlacklist',
        meta: {
          title: '阿里巴巴商家黑名单',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/alibabaShopBlacklist/index.vue'),
      },

      {
        path: 'jdHostList',
        name: 'jdHostList',
        meta: {
          title: '京东选品',
          permissions: 1,
          keepAlive: true,
          weapp:true,
        },
        component: () => import('../views/ep/jd/hostList.vue'),
      },
      {
        path: 'jdOfferSearch',
        name: 'jdOfferSearch',
        meta: {
          title: '京东搜索结果',
          permissions: 1,
          notShowMenu: true,
          keepAlive: true,
          weapp:true,
        },
        component: () => import('../views/ep/jd/offerSearch.vue'),
      },
      {
        path: 'jdGoodDetail/:id',
        name: 'jdGoodDetail',
        meta: {
          title: '京东商品详情',
          permissions: 1,
          notShowMenu: true,
          keepAlive: false,
          weapp:true,
        },
        component: () => import('../views/ep/jd/goodDetail.vue'),
      },
      {
        path: 'jdOrder',
        name: 'jdOrder',
        meta: {
          title: '京东订单',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/ep/jd/jdOrder.vue'),
      },
      {
        path: 'jdBalanceDetail',
        name: 'jdBalanceDetail',
        meta: {
          title: '京东余额明细',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/ep/jd/jdBalanceDetail.vue'),
      },
      {
        path: 'jdMessage',
        name: 'jdMessage',
        meta: {
          title: '京东消息推送',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/ep/jd/jdMessage.vue'),
      },


    ]
  },

  // {
  //   path: '/order',
  //   name: 'Order',
  //   component: () => import('../views/home/Home.vue'),
  //   meta: {
  //     title: '订单/配送',
  //     icon:'md-reorder',
  //     keepAlive: true,
  //     weapp:true,
  //     shop:true
  //   },
  //   children: [
  //     {
  //       path: 'order',
  //       name: 'order',
  //       meta: {
  //         title: '订单管理',
  //         icon:'md-paper',
  //         permissions: 1,
  //         keepAlive: true,
  //         weapp:true,
  //         shop:true
  //       },
  //       component: () => import('../views/order/index.vue'),
  //     },
  //   ]
  // },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '订单/配送',
      icon:'md-reorder',
      permissions: 1,
      weapp:true,
      shop:true,
      keepAlive: true,
    },
    component: () => import('../views/order/index.vue'),
  },
  {
    path: '/orderAfter',
    name: 'orderAfter',
    meta: {
      title: '售后处理',
      icon:'md-help-buoy',
      permissions: 1,
      keepAlive: true,
    },
    component: () => import('../views/orderAfter/index.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '用户管理',
      icon:'md-people',
      permissions: 1,
      keepAlive: true
    },
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '普通用户',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/user/index.vue'),
      },
      {
        path: 'systemUser',
        name: 'systemUser',
        meta: {
          title: '机器人用户',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/user/systemUser.vue'),
      },
    ]
  },


  {
    path: '/withdrawal',
    name: 'withdrawal',
    meta: {
      title: '分销提现',
      icon:'logo-yen',
      permissions: 1,
      keepAlive: true,
    },
    component: () => import('../views/user/withdrawal.vue'),
  },
  {
    path: '/coupon',
    name: 'coupon',
    meta: {
      title: '优惠券管理',
      icon:'md-color-wand',
      permissions: 1,
      keepAlive: true,
    },
    component: () => import('../views/coupon/index.vue'),
  },
  {
    path: '/returnCashCoupon',
    name: 'returnCashCoupon',
    meta: {
      title: '返现券管理',
      icon:'logo-usd',
      permissions: 1,
      keepAlive: true,
    },
    component: () => import('../views/returnCashCoupon/index.vue'),
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '平台管理',
      icon: 'md-basket',
      permissions: 1,
      keepAlive: true,
      weapp:true
    },
    children: [
      {
        path: 'weapp',
        name: 'weapp',
        meta: {
          title: '平台',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/weapp/index.vue'),
      },
      {
        path: 'industryPackage',
        name: 'IndustryPackage',
        meta: {
          title: '行业商品包',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/industryPackage/index.vue'),
      },
      {
        path: 'shop',
        name: 'Shop',
        meta: {
          title: '商户管理',
          permissions: 1,
          keepAlive: true,
          weapp:true
        },
        component: () => import('../views/shop/index.vue'),
      },
    ]
  },
  {
    path: '/sys',
    name: 'Sys',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '系统配置',
      icon:'logo-dropbox',
      permissions: 1,
      keepAlive: true,
      weapp:true,
    },
    children: [
      {
        path: 'sysPage',
        name: 'SysPage',
        meta: {
          title: '配置',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/sysPage/index.vue'),
      },
      {
        path: 'indexBox',
        name: 'indexBox',
        meta: {
          title: '首页格子',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/indexBox/index.vue'),
      },
      {
        path: 'indexClassTag',
        name: 'indexClassTag',
        meta: {
          title: '首页分类标签',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/indexClassTag/index.vue'),
      },
      {
        path: 'wechatUrl',
        name: 'wechatUrl',
        meta: {
          title: '获取链接',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/wechatUrl/index.vue'),
      },
      {
        path: 'banner',
        name: 'banner',
        meta: {
          title: 'Banner管理',
          permissions: 1,
          keepAlive: true,
          weapp:true,
        },
        component: () => import('../views/banner/index.vue'),
      },
      // {
      //   path: 'wechatAd',
      //   name: 'wechatAd',
      //   meta: {
      //     title: '微信广告管理',
      //     permissions: 1,
      //     keepAlive: true,
      //     weapp:false,
      //   },
      //   component: () => import('../views/wechatAd/index.vue'),
      // },
      {
        path: 'groupChat',
        name: 'groupChat',
        meta: {
          title: '拉群管理',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/groupChat/index.vue'),
      },
      {
        path: 'logistics',
        name: 'logistics',
        meta: {
          title: '物流公司',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/logistics/index.vue'),
      },
      {
        path: 'platform',
        name: 'platform',
        meta: {
          title: '进货平台',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/platform/index.vue'),
      },
      {
        path: 'tag',
        name: 'tag',
        meta: {
          title: '标签库',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/tag/index.vue'),
      },
      {
        path: 'tag/good',
        name: 'tagGood',
        meta: {
          permissions: 1,
          keepAlive: false,
          notShowMenu: true
        },
        component: () => import('../views/tag/good.vue'),
      },
      {
        path: 'emailNotice',
        name: 'emailNotice',
        meta: {
          title: '邮件通知管理',
          permissions: 1,
          keepAlive: true
        },
        component: () => import('../views/emailNotice/index.vue'),
      },
    ]
  },

  {
    path: '/scoreTask',
    name: 'scoreTask',
    redirect: '/demo/demo',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '积分管理',
      icon:'ios-funnel',
      permissions: 1,
      keepAlive: true
    },
    children: [
      {
        path: 'scoreTask',
        name: 'scoreTask',
        meta: {
          title: '任务列表',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreTask/index.vue'),
      },
      {
        path: 'scoreTaskActivity',
        name: 'scoreTaskActivity',
        meta: {
          title: '积分活动',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreTaskActivity/index.vue'),
      },
    ]
  },
  {
    path: '/scoreShop',
    name: 'scoreShop',
    redirect: '/demo/demo',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '积分商城',
      permissions: 1,
      icon:'md-cart',
      keepAlive: true
    },
    children: [
      {
        path: 'banner',
        name: 'scoreShopBanner',
        meta: {
          title: '积分商城Banner管理',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreShop/banner.vue'),
      },
      {
        path: 'section',
        name: 'scoreShopSection',
        meta: {
          title: '积分区间管理',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreShop/section.vue'),
      },
      {
        path: 'good',
        name: 'scoreShopGood',
        meta: {
          title: '积分商品',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreShop/good.vue'),
      },
      {
        path: 'order',
        name: 'scoreShopOrder',
        meta: {
          title: '兑换订单',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/scoreShop/order.vue'),
      },
    ]
  },
  {
    path: '/report',
    name: 'report',
    meta: {
      title: '投诉建议',
      icon:'md-document',
      permissions: 1,
      keepAlive: true
    },
    component: () => import('../views/report/index.vue'),
  },
  {
    path: '/demo',
    name: 'Demo',
    redirect: '/demo/demo',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '示例',
      permissions: 1,
      keepAlive: true
    },
    children: [
      {
        path: 'demo',
        name: 'demo',
        meta: {
          title: '示例1',
          permissions: 1,
          keepAlive: true,
        },
        component: () => import('../views/demo/index.vue'),
      },
    ]
  },

    /*
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/demo',
    component: () => import('../views/home/Home.vue'),
    meta: { keepAlive: true },
    children: [
      {
        path: 'demo',
        name: 'demo',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/demo/index.vue'),
      },
      {
        path: 'class',
        name: 'class',
        meta: { keepAlive: true },
        component: () => import('../views/class/class.vue'),
      },
      {
        path: 'good',
        name: 'good',
        meta: { keepAlive: true },
        component: () => import('../views/good/index.vue'),
      },
      {
        path: 'secondsKill',
        name: 'secondsKill',
        meta: { keepAlive: true },
        component: () => import('../views/good/secondsKill.vue'),
      },
      {
        path: 'secondsKill/secondsKillGood/:secondsKillId',
        name: 'secondsKillGood',
        meta: { keepAlive: true },
        component: () => import('../views/good/secondsKillGood.vue'),
      },

      {
        path: 'colorGood',
        name: 'colorGood',
        meta: { keepAlive: true },
        component: () => import('../views/good/colorGood.vue'),
      },
      {
        path: 'good/add',
        name: 'good-add',
        meta: { keepAlive: false },
        component: () => import('../views/good/add.vue'),
      },
      {
        path: 'comments',
        name: 'comments',
        meta: { keepAlive: false },
        component: () => import('../views/comments/index.vue'),
      },
      {
        path: 'newZone',
        name: 'newZone',
        meta: { keepAlive: true },
        component: () => import('../views/good/newZone.vue'),
      },
      {
        path: 'alibabaOrder',
        name: 'alibabaOrder',
        meta: { keepAlive: true },
        component: () => import('../views/ep/alibabaOrder.vue'),
      },
      {
        path: 'alibabaGoodGroup',
        name: 'alibabaGoodGroup',
        meta: { keepAlive: true },
        component: () => import('../views/ep/alibabaGoodGroup.vue'),
      },
      {
        path: 'alibabaGood/:group_id',
        name: 'alibabaGood',
        meta: { keepAlive: false },
        component: () => import('../views/ep/alibabaGood.vue'),
      },

      {
        path: 'alibaba/detail/:id',
        name: 'alibabaDetail',
        meta: { keepAlive: true },
        component: () => import('../views/ep/alibabaDetail.vue'),
      },
      {
        path: 'logistics',
        name: 'logistics',
        meta: { keepAlive: true },
        component: () => import('../views/logistics/index.vue'),
      },

      {
        path: 'platform',
        name: 'platform',
        meta: { keepAlive: true },
        component: () => import('../views/platform/index.vue'),
      },
      {
        path: 'order',
        name: 'order',
        meta: { keepAlive: true },
        component: () => import('../views/order/index.vue'),
      },
      {
        path: 'piliang',
        name: 'piliang',
        meta: { keepAlive: true },
        component: () => import('../views/demo/index.vue'),
      },
      {
        path: 'orderAfter',
        name: 'orderAfter',
        meta: { keepAlive: true },
        component: () => import('../views/orderAfter/index.vue'),
      },
      {
        path: 'coupon',
        name: 'coupon',
        meta: { keepAlive: true },
        component: () => import('../views/coupon/index.vue'),
      },
      {
        path: 'user',
        name: 'user',
        meta: { keepAlive: true },
        component: () => import('../views/user/index.vue'),
      },
      {
        path: 'systemUser',
        name: 'systemUser',
        meta: { keepAlive: true },
        component: () => import('../views/user/systemUser.vue'),
      },
      {
        path: 'tag',
        name: 'tag',
        meta: { keepAlive: true },
        component: () => import('../views/tag/index.vue'),
      },
      {
        path: 'tag/good',
        name: 'tagGood',
        meta: { keepAlive: false },
        component: () => import('../views/tag/good.vue'),
      },
      {
        path: 'report',
        name: 'report',
        meta: { keepAlive: true },
        component: () => import('../views/report/index.vue'),
      },
      {
        path: 'groupChat',
        name: 'groupChat',
        meta: { keepAlive: true },
        component: () => import('../views/groupChat/index.vue'),
      },
      {
        path: 'indexBox',
        name: 'indexBox',
        meta: { keepAlive: true },
        component: () => import('../views/indexBox/index.vue'),
      },
      {
        path: 'banner',
        name: 'banner',
        meta: { keepAlive: true },
        component: () => import('../views/banner/index.vue'),
      },
      {
        path: 'emailNotice',
        name: 'emailNotice',
        meta: { keepAlive: true },
        component: () => import('../views/emailNotice/index.vue'),
      },

      {
        path: 'activity',
        name: 'activity',
        meta: { keepAlive: true },
        component: () => import('../views/activity/index.vue'),
      },
      {
        path: 'theme',
        name: 'theme',
        meta: { keepAlive: true },
        component: () => import('../views/activity/theme.vue'),
      },
      {
        path: 'activityClass',
        name: 'activityClass',
        meta: { keepAlive: true },
        component: () => import('../views/activity/class.vue'),
      },
      {
        path: 'activity/good/:activity_id',
        name: 'activityGood',
        meta: { keepAlive: false },
        component: () => import('../views/activity/good.vue'),
      },
      {
        path: 'activity/box/:activity_id',
        name: 'activityBox',
        meta: { keepAlive: false },
        component: () => import('../views/activity/box.vue'),
      },
    ]
  }

     */

]

const router = new VueRouter({
  routes
})

import store from '@/store'
import el from "element-ui/src/locale/lang/el";
router.beforeEach(async(to, from, next) => {
  store.commit('setMenuActiveName',to.name)
  let userInfo=await store.dispatch('getUserInfo')
  let routerArr=routes
  let weapp=null
  if(userInfo && userInfo.weapp){
    weapp = userInfo.weapp; // 等级获取
    routerArr =await WeappRouterCheck(routes,weapp);

  }
  console.log("userInfo",userInfo)
  if(userInfo && userInfo.shop_id){
    routerArr =await ShopRouterCheck(routes,userInfo.shop_id);
  }

  localStorage.setItem('routerArr', JSON.stringify(routerArr));
  let auto=false
  for(let i in routerArr){
    if(routerArr[i].children){
      for(let t in routerArr[i].children){
        if(routerArr[i].children[t].name==to.name){
          auto=true;
          break;
        }
      }
    }else {
      if(routerArr[i].name==to.name){
        auto=true;
        break;
      }
    }
  }
  if (to.path === '/') {
    next()
  }
  else {
    if (!store.state.userInfo.accessToken) {
      next({
        path: '/',
        // query: { redirect: to.fullPath }
      })
    }else if(!auto){
      Message.error('没有权限访问')
      next({
        path: '/',
        // query: { redirect: to.fullPath }
      })
    }else {
      next()
    }
  }
  console.log(to)
  if(!to.meta.view && to.meta.title){
    store.dispatch('worktabRoute', {
      to: {
        name: to.name ? to.name : '',
        tabname: (to.meta && to.meta.title) ? to.meta.title : '',
        path: to.fullPath
      },
      from: {
        name: from.name ? from.name : '',
        tabname: (from.meta && from.meta.title) ? from.meta.title : '',
        path: from.fullPath
      }
    })
  }




});


// 路由等级检查导入 根据等级筛选可视路由
const WeappRouterCheck =async (routerArr,weapp) => {
  let newArray = [];
  if(weapp==0){
    newArray=routerArr;
  }else {
    for (const i in routerArr) {
      if(routerArr[i].meta.weapp==true){
        if(routerArr[i].children){
          let children=[]
          let childrenMenu=[],childrenNoMenu=[]
          for(let t in routerArr[i].children){
            if(routerArr[i].children[t].meta.weapp==true){
              children.push(routerArr[i].children[t])
              if(!routerArr[i].children[t].meta.notShowMenu){
                childrenMenu.push(routerArr[i].children[t])
              }else{
                childrenNoMenu.push(routerArr[i].children[t])
              }
            }
          }
          if(childrenMenu.length==1){
            if(!childrenMenu[0].path.includes('/'))childrenMenu[0].path=routerArr[i].path+'/'+childrenMenu[0].path;
            for(let o in childrenNoMenu){
              newArray.push(childrenNoMenu[o]);
            }
            newArray.push(childrenMenu[0]);
          }else {
            routerArr[i].children=children;
            newArray.push(routerArr[i]);
          }
        }else {
          newArray.push(routerArr[i]);
        }
      }
    }
  }
  return newArray;
};
const ShopRouterCheck =async (routerArr,shop) => {
  let newArray = [];
  if(shop==0){
    newArray=routerArr;
  }else {
    for (const i in routerArr) {
      if(routerArr[i].meta.shop==true){
        if(routerArr[i].children){
          let children=[]
          let childrenMenu=[],childrenNoMenu=[]
          for(let t in routerArr[i].children){
            if(routerArr[i].children[t].meta.shop==true){
              children.push(routerArr[i].children[t])
              if(!routerArr[i].children[t].meta.notShowMenu){
                childrenMenu.push(routerArr[i].children[t])
              }else{
                childrenNoMenu.push(routerArr[i].children[t])
              }
            }

          }
          if(childrenMenu.length==1){
          // if(children.length==1){
            if(!childrenMenu[0].path.includes('/'))childrenMenu[0].path=routerArr[i].path+'/'+childrenMenu[0].path;
            for(let o in childrenNoMenu){
              newArray.push(childrenNoMenu[o]);
            }
            newArray.push(children[0]);
          }else {
            routerArr[i].children=children;
            newArray.push(routerArr[i]);
          }
        }else {
          newArray.push(routerArr[i]);
        }
      }
    }
  }
  return newArray;
};

export default router

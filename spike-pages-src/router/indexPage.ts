export const permissData: { [k: string]: string | null } = {
  'home'           : null,   // '首页'
  'overview'       : '100', // '数据总览'
  'patientList'    : '2',   // '患者列表'
  'fileManagement' : '11',  // '文件管理'
  // '用户管理'     : '21',  // '用户管理'
  'userList'       : '22',  // '用户列表'
  'roleList'       : '23',  // '角色列表'
}

export const indexPage: IRouter[] = [
  {
    path: '/403',
    name: '403',
    meta: {
      title: ['403'],
    },
    component: () => import('@v/errorPage/403.vue')
  },
    {
    path: '/multiImageCoreg',
    name: 'multiImageCoreg',
    meta: {
      title: ['共注册'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/gzc/Index.vue')
  },
  {
    path: '/overview',
    name: 'overview',
    meta: {
      title: ['数据总览'],
      permiss: permissData['overview'],
    },
    component: () => import('@v/overview/Index.vue')
  },
  {
    path: '/patientList',
    name: 'patientList',
    meta: {
      title: ['患者列表'],
      permiss: permissData['patientList'],
      keepAlive: true
    },
    component: () => import('@v/patientList/Index.vue')
  },
  {
    path: '/patientDetail',
    name: 'patientDetail',
    meta: {
      title: ['患者详情'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/patientList/patientDetail/Index.vue')
  },
  {
    path: '/fileManagement',
    name: 'fileManagement',
    meta: {
      title: ['文件管理'],
      permiss: permissData['fileManagement'],
    },
    component: () => import('@v/fileMan/Index.vue')
  },
  {
    path: '/userList',
    name: 'userList',
    meta: {
      title: ['用户列表'],
      permiss: permissData['userList'],
    },
    component: () => import('@v/userList/Index.vue')
  },
  {
    path: '/roleList',
    name: 'roleList',
    meta: {
      title: ['角色列表'],
      permiss: permissData['roleList'],
    },
    component: () => import('@v/roleList/Index.vue')
  },
  {
    path: '/reviewMeg',
    name: 'reviewMeg',
    meta: {
      title: ['脑磁图复核'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/reviewMeg/Index.vue')
  },
  {
    path: '/reviewEeg',
    name: 'reviewEeg',
    meta: {
      title: ['脑电图复核'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/reviewEeg/Index.vue')
  },
  {
    path: '/viewResults',
    name: 'viewResults',
    meta: {
      title: ['结果查看'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/viewResults/Index.vue')
  },
  {
    path: '/clusterList',
    name: 'clusterList',
    meta: {
      title: ['聚类列表'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/clusterList/Index.vue')
  },
  {
    path: '/reviewMri',
    name: 'reviewMri',
    meta: {
      title: ['结构像复核'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/reviewMri/Index.vue')
  },
  {
    path: '/report',
    name: 'report',
    meta: {
      title: ['溯源分析报告'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/report/Index.vue')
  },
  {
    path: '/clinicalReports',
    name: 'clinicalReports',
    meta: {
      title: ['临床报告'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/clinicalReports/Index.vue')
  },
  {
    path: '/startAnalysis',
    name: 'startAnalysis',
    meta: {
      title: ['溯源发起'],
      permiss: permissData['patientList'],
    },
    component: () => import('@v/startAnalysis/Index.vue')
  },





  // 下面是用不到的页面
  // {
  //   path: '/setting',
  //   name: 'setting',
  //   meta: {
  //     title: ['设置'],
  //   },
  //   component: () => import('@v/demo/setting/Index.vue')
  // },
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   meta: {
  //     title: ['测试'],
  //   },
  //   component: () => import('@v/demo/Index.vue')
  // },

  // {
  //   path: '/three',
  //   name: 'three',
  //   meta: {
  //     title: ['three'],
  //   },
  //   component: () => import('@v/demo/test/three.vue')
  // },
  // {
  //   path: '/three2',
  //   name: 'three2',
  //   meta: {
  //     title: ['three2'],
  //   },
  //   component: () => import('@v/demo/test/three2.vue')
  // },

  // {
  //   path: '/test',
  //   name: 'test',
  //   meta: {
  //     title: ['test'],
  //   },
  //   component: () => import('@v/demo/test/Index.vue')
  // },

  // {
  //   path: '/test2',
  //   name: 'test2',
  //   meta: {
  //     title: ['test-千问'],
  //   },
  //   component: () => import('@v/demo/test/Index2.vue')
  // },

  // {
  //   path: '/test2',
  //   name: 'test2',
  //   meta: {
  //     title: ['test2'],
  //   },
  //   component: () => import('@v/demo/test/test.vue')
  // },
  // {
  //   path: '/test2',
  //   name: 'test2',
  //   meta: {
  //     title: ['test'],
  //   },
  //   component: () => import('@v/demo/test/test2.vue')
  // },

  // {
  //   path: '/nii',
  //   name: 'nii',
  //   meta: {
  //     title: ['nii'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index.vue')
  // },
  // {
  //   path: '/nii7',
  //   name: 'nii7',
  //   meta: {
  //     title: ['nii7'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index7.vue')
  // },
  // {
  //   path: '/nii77',
  //   name: 'nii77',
  //   meta: {
  //     title: ['nii77'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index77.vue')
  // },
  // {
  //   path: '/nii8',
  //   name: 'nii8',
  //   meta: {
  //     title: ['nii8'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index8.vue')
  // },
  // {
  //   path: '/nii9',
  //   name: 'nii9',
  //   meta: {
  //     title: ['nii9'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index9.vue')
  // },

  // {
  //   path: '/nii2',
  //   name: 'nii2',
  //   meta: {
  //     title: ['nii2'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index2.vue')
  // },
  // {
  //   path: '/nii3',
  //   name: 'nii3',
  //   meta: {
  //     title: ['nii3'],
  //     permiss: '100'
  //   },
  //   component: () => import('@v/demo/nii/Index3.vue')
  // },


  // {
  //   path: '/document',
  //   name: 'document',
  //   meta: {
  //     title: ['文档规范'],
  //     permiss: null
  //   },
  //   component: () => import('@v/document/Index.vue')
  // },
  // {
  //   path: "/documentDetail",
  //   name: "documentDetail",
  //   meta: {
  //     title: ["标准规范", "详情"],
  //     permiss: null
  //   },
  //   component: () => import("@v/document/detail/Index.vue")
  // },
  // {
  //   path: '/resource',
  //   name: 'resource',
  //   meta: {
  //     title: ['资源列表'],
  //     permiss: null
  //   },
  //   component: () => import('@v/resource/Index.vue')
  // },
  // {
  //   path: "/resourceDetail",
  //   name: "resourceDetail",
  //   meta: {
  //     title: ["资源列表", "详情"],
  //     permiss: null
  //   },
  //   component: () => import("@v/resource/detail/Index.vue")
  // },

]
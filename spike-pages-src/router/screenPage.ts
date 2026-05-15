export const screenPage = {
  path: '/screen',
  alias: '/screen/index',
  name: 'screen',
  meta: {
    title: ['大屏'],
  },
  component: () => import('@v/demo/screen/Index.vue'),
  children: [
    {
      path: '/screen/bar',
      name: 'screen/bar',
      meta: {
        title: ['柱状图'],
      },
      component: () => import('@v/demo/screen/bar/Index.vue')
    },
    {
      path: '/screen/line',
      name: 'screen/line',
      meta: {
        title: ['折线图'],
      },
      component: () => import('@v/demo/screen/line/Index.vue')
    },
    {
      path: '/screen/pie',
      name: 'screen/pie',
      meta: {
        title: ['饼状图'],
      },
      component: () => import('@v/demo/screen/pie/Index.vue')
    },

    {
      path: '/screen/map',
      name: 'screen/map',
      meta: {
        title: ['地图'],
      },
      component: () => import('@v/demo/screen/map/Index.vue')
    },
    {
      path: '/screen/other',
      name: 'screen/other',
      meta: {
        title: ['其他图'],
      },
      component: () => import('@v/demo/screen/other/Index.vue')
    },
    {
      path: '/screen/table',
      name: 'screen/table',
      meta: {
        title: ['表格'],
      },
      component: () => import('@v/demo/screen/table/Index.vue')
    },
    {
      path: '/screen/list',
      name: 'screen/list',
      meta: {
        title: ['列表'],
      },
      component: () => import('@v/demo/screen/list/Index.vue')
    },
    {
      path: '/screen/example',
      name: 'screen/example',
      meta: {
        title: ['例子'],
      },
      component: () => import('@v/demo/screen/example/Index.vue')
    },

  ],
}
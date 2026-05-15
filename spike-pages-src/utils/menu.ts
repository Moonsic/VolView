export const leftMenuData = [
  // 谁在第一个，谁就是默认页面
  {
    path: 'patientList',
    name: t('患者列表'),
    icon: 'ScheduleOutlined',
  },
  {
    path: 'fileManagement',
    name: t('文件管理'),
    icon: 'FileSearchOutlined',
  },
  {
    path: '', // 文件夹无path
    name: t('用户管理'),
    icon: 'SolutionOutlined',
    children: [
      {
        path: 'userList',
        name: t('用户列表'),
        icon: 'TeamOutlined',
      },
      {
        path: 'roleList',
        name: t('角色列表'),
        icon: 'UserSwitchOutlined',
      },
    ],
  },
  {
    path: 'overview',
    name: t('数据总览'),
    icon: 'PieChartOutlined',
  },

]
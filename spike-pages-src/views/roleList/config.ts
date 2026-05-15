import { formatDateString } from '@u/utils'

export const tableConfig = {
  columns: [
    {
      title: t('序号'),
      dataIndex: 'theIndex',
      width: 80,
      align: 'center'
    },
    {
      title: t('角色名称'),
      dataIndex: 'roleName',
    },
    {
      title: t('创建时间'),
      dataIndex: 'createTime',
      customRender: ({ text }: { text: string }) => {
        return formatDateString(text)
      }
    },
    {
      title: t('操作'),
      dataIndex: 'operation',
      width: 160,
      ellipsis: true
    }
  ],
}
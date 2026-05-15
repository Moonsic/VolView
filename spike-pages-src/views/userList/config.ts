import { arrayToObj, formatDateString } from '@u/utils'
import { genderList } from '@u/data'

const genderObj = arrayToObj(genderList)

export const tableConfig = {
  columns: [
    {
      title: t('序号'),
      dataIndex: 'theIndex',
      width: 80,
      align: 'center'
    },
    {
      title: t('姓名'),
      dataIndex: 'name',
    },
    {
      title: t('账号'),
      dataIndex: 'account',
    },
    {
      title: t('性别'),
      dataIndex: 'gender',
      key: 'gender',
      customRender: ({ text }: { text: number }) => {
        return genderObj[text] || '-'
      },
    },
    {
      title: t('角色名称'),
      dataIndex: 'roleName',
    },
    {
      title: t('创建时间'),
      dataIndex: 'createTime',
      customRender: ({ text }: { text: string }) => {
        return formatDateString(text) || '-'
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
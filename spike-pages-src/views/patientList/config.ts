import { arrayToObj, formatDate } from '@u/utils'
import { genderList } from '@u/data'

const genderObj = arrayToObj(genderList)

export const tableConfig = {
  columns: [
    {
      title: t('序号'),
      dataIndex: 'theIndex',
      width: 60,
      align: 'center'
    },
    {
      title: t('患者编号'),
      dataIndex: 'megId',
      sorter: true,
    },
    {
      title: t('姓名'),
      dataIndex: 'subjectName',
      customRender: ({ text }: { text: string }) => {
        return text || '-'
      },
      sorter: true
    },
    {
      title: t('性别'),
      dataIndex: 'gender',
      customRender: ({ text }: { text: number }) => {
        return genderObj[text] || '-'
      },
      align: 'center',
      sorter: true
    },
    {
      title: t('年龄'),
      dataIndex: 'age',
      align: 'center',
      sorter: true
    },
    {
      title: t('影像扫描日期'),
      dataIndex: 'scanDate',
      customRender: ({ text }: { text: string }) => {
        return formatDate(text, 'YYYY-MM') || '-'
      },
      sorter: true
    },
    {
      title: t('脑磁检查时间'),
      dataIndex: 'megCheckTime',
      customRender: ({ text }: { text: string }) => {
        return formatDate(text, 'YYYY-MM-DD') || '-'
      },
      sorter: true
    },
    {
      title: t('脑磁检查类型'),
      dataIndex: 'megCheckType',
      sorter: true
    },
    {
      title: t('致痫灶位置'),
      dataIndex: 'epilepticLocation',
      sorter: true
    },
    // {
    //   title: '数据集大小',
    //   dataIndex: 'totalSize',
    // },
    {
      title: t('溯源状态'),
      dataIndex: 'pipelineStatus',
      align: 'center',
      width: 110,
      sorter: true
    },
    {
      title: t('复核状态'),
      dataIndex: 'checked',
      align: 'center',
      width: 110,
      sorter: true
    },
    {
      title: t('创建时间'),
      dataIndex: 'createTime',
      width: 120,
      customRender: ({ text }: { text: string }) => {
        return formatDate(text, 'YYYY-MM-DD') || '-'
      },
      sorter: true
    },
    {
      title: t('操作'),
      dataIndex: 'operation',
      width: 200,
      ellipsis: true,
    }
  ],
}
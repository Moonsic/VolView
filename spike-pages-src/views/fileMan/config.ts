import { formatDateString, formatFileSize } from '@u/utils'

export const tableConfig = {
  columns: [
    {
      title: t('类型'),
      dataIndex: 'theIndex',
      width: 80,
      align: 'center',
    },
    {
      title: t('名称'),
      dataIndex: 'name',
    },
    {
      title: t('最后修改时间'),
      dataIndex: 'lastModified',
      customRender: ({ text }: { text: string }) => {
        return formatDateString(text)
      },
      sorter: {
        compare: (a: IAnyObject, b: IAnyObject) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime(),
      }
    },
    {
      title: t('大小'),
      dataIndex: 'size',
      customRender: ({ text }: { text: number }) => {
        return formatFileSize(text)
      },
      sorter: {
        compare: (a: IAnyObject, b: IAnyObject) => a.size - b.size,
      }
    },
    {
      title: t('操作'),
      dataIndex: 'operation',
      width: 100,
      ellipsis: true
    }
  ],
}
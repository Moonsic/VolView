import Mock from 'mockjs'

// 格式化url，例：url='/pageApi?pageNum=1&pageSize=10'
function formatUrl(url: string) {
  if (!url.includes('?')) {
    return {}
  }
  const list = url.split('?')[1].split('&')
  const obj: any = {}
  list.forEach((item) => {
    const arr = item.split('=')
    if (arr[0]) {
      obj[arr[0]] = arr[1]
    }
  })
  return obj
}

// 所有数据
const allData: IAnyObject[] = []
for (let i = 1; i <= 6; i++) {
  allData.push({
    id: i,
    name: Mock.mock("@cname"),
    sex: (i % 2) + 1, // 12
    age: 10 + i,
    status: (i % 3) + 1, // 123
    phone: Mock.mock({ regexp: /^1[3456789]\d{9}$/ }).regexp,
    date: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
    createTime: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
    updateDate: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
    startDate: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
    endDate: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
    address: Mock.mock("@city(true)"),
    title: `这是标题 ${Mock.mock("@city(true)")}`,
    desc: "这是一段描述",
    num: Mock.mock("@integer(100,1000)"),
    num2: Mock.mock("@float(60, 100, 2, 2)"),
    code: "1001",
    type: Mock.mock('@pick(["1", "2", "3", "4"])'),
    sourceName: Mock.mock("@cword(2, 4)"),
    tag: Mock.mock("@tld()"),
    jarName: Mock.mock('@string("lower", 5)'),
    icon: "unordered-list",
    list: [
      { field: "list标题1 :", value: "list值1" },
      { field: "list标题2 :", value: "list值2" },
    ],
    resourceType: 1,
    boolean: Mock.mock("@boolean()"),
    shareType: Mock.mock("@pick([1, 2, 3])"),
  })
}

// 分页查询
Mock.mock(RegExp('/mock/pageApi' + '.*'), 'get', (options: IAnyObject) => {
  const params: IAnyObject = formatUrl(options.url)
  const { pageNum = 1, pageSize = 10 } = params
  const list: IAnyObject[] = []
  allData.forEach((item, index) => {
    if (index < pageNum * pageSize && index > (pageNum - 1) * pageSize - 1) {
      list.push(item)
    }
  })
  const res = {
    code: 200,
    msg: '查询成功',
    data: {
      records: list,
      total: allData.length,
    },
  }
  return res
})

// 查询所有数据
Mock.mock(RegExp('/mock/listApi' + '.*'), 'get', (options: any) => {
  const res = {
    code: 200,
    msg: '查询成功',
    data: allData,
  }
  return res
})

const tableTreeData = JSON.parse(JSON.stringify(allData))
tableTreeData.forEach((item: any, index: number) => {
  if (index < 5) {
    item.children = []
    for (let j = 1; j < 5; j++) {
      item.children.push({
        id: `${item.id}${j}`,
        name: Mock.mock('@cname'),
        sex: (j % 2) + 1, // 12
        age: 10 + j,
        status: (j % 3) + 1, // 123
        phone: Mock.mock({ regexp: /^1[3456789]\d{9}$/ }).regexp,
        date: Mock.mock('@datetime("2023-MM-dd HH:mm:ss")'),
        address: Mock.mock('@city(true)'),
      })
    }
  }
})

// 分页查询，获取可展开树表格
Mock.mock(RegExp('/mock/getTableTreeApi' + '.*'), 'get', (options: IAnyObject) => {
  const params: IAnyObject = formatUrl(options.url)
  const { pageNum = 1, pageSize = 10 } = params
  const list: IAnyObject[] = []
  tableTreeData.forEach((item: any, index: number) => {
    if (index < pageNum * pageSize && index > (pageNum - 1) * pageSize - 1) {
      list.push(item)
    }
  })
  const res = {
    code: 200,
    msg: '查询成功',
    data: {
      records: list,
      total: tableTreeData.length,
    },
  }
  return res
})

// 查询详情
Mock.mock(RegExp('/mock/detailApi' + '.*'), 'get', (options: { url: string }) => {
  const params: IAnyObject = formatUrl(options.url)
  const { id } = params
  const record = allData.find((item) => item.id == id)
  const res = {
    code: 200,
    msg: '查询成功',
    data: record,
  }
  return res
})

// 新增
Mock.mock(RegExp('/mock/addApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '新增成功',
  }
  return res
})

// 修改
Mock.mock(RegExp('/mock/editApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '修改成功',
  }
  return res
})

// 删除
Mock.mock(RegExp('/mock/deleteApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '删除成功',
  }
  return res
})

// 批量删除
Mock.mock(RegExp('/mock/deleteBatchApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '删除成功',
  }
  return res
})

// 启动
Mock.mock(RegExp('/mock/startApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '启动成功',
  }
  return res
})

// 停止
Mock.mock(RegExp('/mock/stopApi' + '.*'), 'post', (options: { body: string }) => {
  const data = JSON.parse(options.body)
  const res = {
    code: 200,
    data,
    msg: '停止成功',
  }
  return res
})

let checkNameIndex = 0
// 校验名称重复
Mock.mock(RegExp('/mock/checkNameApi' + '.*'), 'get', (options: any) => {
  let boo = false
  if (checkNameIndex % 3) {
    boo = true
  }
  checkNameIndex++
  const res = {
    code: 200,
    data: boo,
    msg: '操作成功',
  }
  return res
})

// 获取下拉框列表
Mock.mock(RegExp('/mock/getSelectListApi' + '.*'), 'get', (options: any) => {
  const list = [
    { name: '未开始', value: 1 },
    { name: '进行中', value: 2 },
    { name: '已完成', value: 3 },
    { name: '已关闭', value: 4 },
  ]
  const res = {
    code: 200,
    data: list,
    msg: '查询成功',
  }
  return res
})

// 导入
Mock.mock(RegExp('/mock/importApi' + '.*'), 'post', (options: any) => {
  const res: any = {
    code: 200,
    data: null,
    msg: '操作成功',
  }
  return res
})

// 获取树
Mock.mock(RegExp('/mock/getTreeApi' + '.*'), 'get', (options: any) => {
  const data: any = [
    {
      id: 1,
      parentId: 0,
      dirName: '目录一',
      children: [
        {
          id: 11,
          parentId: 1,
          dirName: '目录1-1',
          children: [
            { id: 111, parentId: 11, dirName: '目录1-1-1', children: null },
            { id: 112, parentId: 11, dirName: '目录1-1-2', children: null },
          ],
        },
        { id: 12, parentId: 1, dirName: '目录1-2', children: null },
        { id: 13, parentId: 1, dirName: '目录1-3', children: null },
        { id: 14, parentId: 1, dirName: '目录1-4', children: null },
      ],
    },
    {
      id: 2,
      parentId: 0,
      dirName: '目录二',
      children: [
        { id: 21, parentId: 2, dirName: '目录2-1', children: null },
        { id: 22, parentId: 2, dirName: '目录2-2', children: null },
        { id: 23, parentId: 2, dirName: '目录2-3', children: null },
        { id: 24, parentId: 2, dirName: '目录2-4', children: null },
      ],
    },
    {
      id: 3,
      parentId: 0,
      dirName: '目录三',
      children: [
        { id: 31, parentId: 2, dirName: '目录3-1', children: null },
        { id: 32, parentId: 2, dirName: '目录3-2', children: null },
      ],
    },
    {
      id: 4,
      parentId: 0,
      dirName: '目录四',
      children: [{ id: 41, parentId: 2, dirName: '目录4-1', children: null }],
    },
    { id: 5, parentId: 0, dirName: '目录五', children: null },
    { id: 6, parentId: 0, dirName: '目录六', children: null },
  ]
  const res = {
    code: 200,
    data,
    msg: '查询成功',
  }
  return res
})

Mock.setup({
  timeout: 200,
})
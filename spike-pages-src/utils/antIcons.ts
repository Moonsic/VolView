
import { App } from 'vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CaretDownOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  UserOutlined,
  DownOutlined,
  LockOutlined,
  FundOutlined,
  DownloadOutlined,
  FolderOpenFilled,
  FileOutlined,
  UpOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  ScheduleOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
  DeleteOutlined,
  EyeOutlined,
  RightOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  ExportOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SwapOutlined,
  StepForwardOutlined,
  CaretRightOutlined,

} from '@ant-design/icons-vue'
export const antIconList = {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CaretDownOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  UserOutlined,
  DownOutlined,
  LockOutlined,
  FundOutlined,
  DownloadOutlined,
  FolderOpenFilled,
  FileOutlined,
  UpOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  ScheduleOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
  DeleteOutlined,
  EyeOutlined,
  RightOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  ExportOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SwapOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
}

const AntIcons = {
  install: function (Vue: App) {
   for (const [key, component] of Object.entries(antIconList)) {
     Vue.component(key, component)
   }
  }
 }

 export default AntIcons

 // 注册图标, 全部注册，会使包体积很大
// import * as antIcons from '@ant-design/icons-vue'
// for (const [key, component] of Object.entries(antIcons)) {
//   console.log('key :>> ', key);
//   app.component(key, component)
// }

// 只引入需要的图标
// import { antIconList } from '@u/antIcons'
// for (const [key, component] of Object.entries(antIconList)) {
//   app.component(key, component)
// }

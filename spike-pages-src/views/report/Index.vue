<template>
  <div class="main-page">
    <div class="page-top" :class="{ 'page-top-fixed': isScrollTop}">
      <div class="flex-start">
        <Back class="page-back" :title="pageTitle" />
      </div>

      <div class="flex-start">

        <a-button type="primary" class="flex-center" :disabled="!allData" v-if="!isGetting" @click="getScreenshot()">
          <IconDownload class="text-16" /> 下载报告
        </a-button>

        <a-button type="primary" class="flex-center" v-if="allData && isGetting" :loading="true">
          <!-- <Loading3QuartersOutlined spin /> -->
          报告下载中
        </a-button>

      </div>
    </div>
  </div>

  <!-- <div class="two-cards"> -->

  <a-card class="card-page">

    <div class="page-content" ref="pageRef">

      <img :src="report_bg" />

      <div class="left-top">
        <IconLogo class="logo" />
        <span class="title">{{ SYSTEM_NAME }}</span>
      </div>

      <div class="main-title-box">
        <div class="main-title">{{ megId }}</div>
        <div class="sub-title">{{ t('溯源分析报告') }}</div>
        <span class="time">{{ allData?.generate_time }}</span>
      </div>

      <div class="content-padding">

        <div class="small-title"><img class="icon" :src="subinfo" alt="" />患者信息</div>

        <a-spin :spinning="loading" class="widthP100">
          <div class="list wdithP100">
            <div class="header">
              <div>患者ID</div>
              <div>姓名</div>
              <div>出生日期</div>
              <div>性别</div>
            </div>
            <div class="item">
              <div>{{ allData?.sub_info.sub_id }}</div>
              <div>{{ allData?.sub_info.sub_name }}</div>
              <div>{{ allData?.sub_info.birth_date }}</div>
              <div>{{ allData?.sub_info.gender }}</div>
            </div>
          </div>
        </a-spin>

        <div class="small-title"><img class="icon" :src="meginfo" alt="" />MEG信息</div>

        <a-spin :spinning="loading" class="widthP100">
          <div class="list wdithP100">
            <div class="header">
              <div>通道</div>
              <div>日期</div>
              <div>时长（分钟）</div>
              <div>分段</div>
            </div>
            <div class="item">
              <div>{{ allData?.meg_info.sensors }}</div>
              <div>{{ allData?.meg_info.scan_date }}</div>
              <div>{{ allData?.meg_info.duration }}</div>
              <div>{{ allData?.meg_info.segments }}</div>
            </div>
          </div>
        </a-spin>

        <div class="small-title"><img class="icon" :src="summary" alt="" />总结</div>

        <a-skeleton active v-if="loading" />

        <div class="summary" v-if="allData?.sum_info">
          <div class="mb8">MEG数据总时长 {{ allData?.sum_info.duration }} 分钟，算法检测出 {{ allData?.sum_info.total_ied_num }}
            个IED事件，主要分布在【 {{ allData?.sum_info.ied_top2_br.join('，') }} 】，
          </div>
          <div>手动标注 {{ allData?.ied_data.manual_spikes_num }} 个IED事件，聚类后主要有 {{ allData?.sum_info.ied_cluster_classes }}
            个类别。
          </div>
        </div>


        <div class="small-title-bg mt40"><img class="icon" :src="iconBrain" alt="" />IED溯源定位</div>


        <a-spin :spinning="loading" class="widthP100">
          <ListView class="widthP100" ref="listViewRef" :source_location_pts="allData?.source_location_pts"
            :cluster_source_location_pts="allData?.cluster_source_location_pts" :nii_file_path="allData?.nii_file_path"
            @getLeftScreenshot="getLeftScreenshot" />
        </a-spin>


        <div class="small-title-bg mt40"><img class="icon" :src="iconBrain" alt="" />MEG-MRI自动配准</div>

        <a-spin :spinning="loading" class="widthP100"></a-spin>

        <div class="flex-center flex-column coreg-img-list" v-if="allData?.coreg_data">
          <div class="flex-1 mb32">
            <img class="zoom-in" :src="`${allData?.coreg_data.fiducials_fig}`"
              @click="previewImg(allData?.coreg_data.fiducials_fig)" />
            <div class="img-title mb24">图1-1 初始基准点标记</div>
          </div>
          <div class="flex-1">
            <img class="zoom-in" :src="`${allData?.coreg_data.coreg_result}`"
              @click="previewImg(allData?.coreg_data.coreg_result)" />
            <div class="img-title mb24">图1-2 MEG-MRI最终配准结果</div>
          </div>
        </div>

        <div class="small-title-bg mt40"><img class="icon" :src="iconBrain" alt="" />IED数量分布</div>

        <a-spin :spinning="loading">
          <div class="list ied-list">
            <div class="header">
              <div>脑区</div>
              <div v-for="(item, index) in brainRegionList" :key="index">{{ item }}</div>
            </div>
            <div class="item item-bg-white">
              <div>IED阳性数量</div>
              <div v-for="(item, index) in brainRegionList" :key="index">
                {{ allData?.ied_data.ied_brain_stat[item].num }}
              </div>
            </div>
            <div class="item">
              <div>占比</div>
              <div v-for="(item, index) in brainRegionList" :key="index">
                {{ allData?.ied_data.ied_brain_stat[item].percent }}
              </div>
            </div>
          </div>
        </a-spin>


        <a-spin :spinning="loading" class="widthP100"></a-spin>

        <div class="flex-center flex-wrap ied-img-list" v-if="allData?.ied_data">
          <!-- <div :class="{ 'widthP100': Object.keys(allData?.ied_data.seg_ied_dist).length === 1 }"
            v-for="(value, key, index) in allData?.ied_data.seg_ied_dist" :key="index">
            <img class="zoom-in" :src="`${value}`" @click="previewImg(value)" />
            <div class="img-title">图2-{{ index + 1 }}. 第{{ index + 1 }}段MEG数据IED分布</div>
          </div> -->


          <div :class="{ 'widthP100': allData?.ied_data.seg_ied_dist.length === 1 }"
            v-for="(item, index) in allData?.ied_data.seg_ied_dist" :key="index">
            <img class="zoom-in" :src="`${item.fig_url}`" @click="previewImg(item.fig_url)" />
            <div class="img-title">图2-{{ index + 1 }}. {{ item.fif_fname }} 文件的MEG数据IED分布</div>
          </div>

        </div>

        <div class="small-title-bg mt32"><img class="icon" :src="iconBrain" alt="" />IED聚类详情</div>

        <a-spin :spinning="loading" class="widthP100"></a-spin>

        <div class="cluster-img-list" v-if="allData?.cluster_fig_data">

          <div class="mb32" v-for="(value, key, index) in allData?.cluster_fig_data" :key="index">
            <img class="zoom-in" :src="`${value}`" @click="previewImg(value)" />
            <div class="img-title">图3-{{ index + 1 }}. {{ key }} 的波形图和拓扑图</div>
          </div>
        </div>
      </div>

    </div>

  </a-card>





  <!-- 隐藏页面，不展示，用于下载 -->
  <!-- <a-card class="card-page card-page-hide" v-if="true"> -->
  <a-card class="card-page card-page-hide none" v-if="showBottomPage">


    <div class="page-content" ref="pageRef" id="new-report-page">

      <img :src="report_bg" />

      <div class="left-top">
        <IconLogo class="logo" />
        <span class="title">{{ SYSTEM_NAME }}</span>
      </div>

      <div class="main-title-box">
        <div class="main-title">{{ megId }}</div>
        <div class="sub-title">{{ t('溯源分析报告') }}</div>
        <span class="time">{{ allData?.generate_time }}</span>
      </div>

      <div class="content-padding">

        <div class="small-title"><img class="icon" :src="subinfo" alt="" />患者信息</div>

        <div class="list wdithP100">
          <div class="header">
            <div>患者ID</div>
            <div>姓名</div>
            <div>出生日期</div>
            <div>性别</div>
          </div>
          <div class="item">
            <div>{{ allData?.sub_info.sub_id }}</div>
            <div>{{ allData?.sub_info.sub_name }}</div>
            <div>{{ allData?.sub_info.birth_date }}</div>
            <div>{{ allData?.sub_info.gender }}</div>
          </div>
        </div>

        <div class="small-title"><img class="icon" :src="meginfo" alt="" />MEG信息</div>

        <div class="list wdithP100">
          <div class="header">
            <div>通道</div>
            <div>日期</div>
            <div>时长（分钟）</div>
            <div>分段</div>
          </div>
          <div class="item">
            <div>{{ allData?.meg_info.sensors }}</div>
            <div>{{ allData?.meg_info.scan_date }}</div>
            <div>{{ allData?.meg_info.duration }}</div>
            <div>{{ allData?.meg_info.segments }}</div>
          </div>
        </div>

        <div class="small-title"><img class="icon" :src="summary" alt="" />总结</div>

        <div class="summary" v-if="allData?.sum_info">
          <div class="mb8">MEG数据总时长 {{ allData?.sum_info.duration }} 分钟，算法检测出 {{ allData?.sum_info.total_ied_num }}
            个IED事件，主要分布在【 {{ allData?.sum_info.ied_top2_br.join('，') }} 】，
          </div>
          <div>手动标注 {{ allData?.ied_data.manual_spikes_num }} 个IED事件，聚类后主要有 {{ allData?.sum_info.ied_cluster_classes }}
            个类别。
          </div>
        </div>


        <div class="bg-gray-line page-break"></div>
        <div class="small-title-bg mt32"><img class="icon" :src="iconBrain" alt="" />IED溯源定位</div>


        <ListViewImg class="widthP100" :leftScreenshot="leftScreenshot" :screenshot3D="screenshot3D"
          :screenshotList="screenshotList" />


        <div class="small-title-bg mt32"><img class="icon" :src="iconBrain" alt="" />MEG-MRI自动配准</div>


        <div class="flex-center flex-column coreg-img-list" v-if="allData?.coreg_data">
          <div class="flex-1">
            <img :src="`${allData?.coreg_data.fiducials_fig}`" />
            <div class="img-title">图1-1 初始基准点标记</div>
          </div>
          <div class="bg-gray-line page-break"></div>
          <div class="flex-1 mt32">
            <img :src="`${allData?.coreg_data.coreg_result}`" />
            <div class="img-title">图1-2 MEG-MRI最终配准结果</div>
          </div>
        </div>

        <!-- 测试用的 -->
        <!-- <div class="flex-center flex-column coreg-img-list">
          <div class="flex-1">
            <img :src="testimg" />
            <div class="img-title">图1-1 初始基准点标记test</div>
          </div>
          <div class="bg-gray-line page-break"></div>
          <div class="flex-1 mt32">
            <img :src="testimg" />
            <div class="img-title">图1-2 MEG-MRI最终配准结果test</div>
          </div>
        </div> -->



        <div class="small-title-bg mt32"><img class="icon" :src="iconBrain" alt="" />IED数量分布</div>

        <div class="list ied-list">
          <div class="header">
            <div>脑区</div>
            <div v-for="(item, index) in brainRegionList" :key="index">{{ item }}</div>
          </div>
          <div class="item item-bg-white">
            <div>IED阳性数量</div>
            <div v-for="(item, index) in brainRegionList" :key="index">
              {{ allData?.ied_data.ied_brain_stat[item].num }}
            </div>
          </div>
          <div class="item">
            <div>占比</div>
            <div v-for="(item, index) in brainRegionList" :key="index">
              {{ allData?.ied_data.ied_brain_stat[item].percent }}
            </div>
          </div>
        </div>


        <div class="flex-center flex-wrap ied-img-list" v-if="allData?.ied_data">
          <!-- <div :class="{ 'widthP100': Object.keys(allData?.ied_data.seg_ied_dist).length === 1 }"
            v-for="(value, key, index) in allData?.ied_data.seg_ied_dist" :key="index">
            <img :src="`${value}`" />
            <div class="img-title">图2-{{ index + 1 }}. 第{{ index + 1 }}段MEG数据IED分布</div>
          </div> -->

          <div :class="{ 'widthP100': allData?.ied_data.seg_ied_dist.length === 1 }"
            v-for="(item, index) in allData?.ied_data.seg_ied_dist" :key="index">
            <img class="zoom-in" :src="`${item.fig_url}`" @click="previewImg(item.fig_url)" />
            <div class="img-title">图2-{{ index + 1 }}. {{ item.fif_fname }} 文件的MEG数据IED分布</div>
          </div>


        </div>

        <!-- 测试用的 -->
        <!-- widthP100 -->
        <!-- <div class="flex-center flex-wrap ied-img-list">
          <div v-for="(item, index) in 24" :key="item" >
            <img :src="testimg" />
            <div class="img-title">图2-{{ index + 1 }}. 第{{ index + 1 }}段MEG数据IED分布</div>
          </div>
        </div> -->


        <div class="bg-gray-line page-break"></div>
        <div class="small-title-bg mt32"><img class="icon" :src="iconBrain" alt="" />IED聚类详情</div>


        <div class="cluster-img-list" v-if="allData?.cluster_fig_data">
          <div class="mb100" :class="{ 'pt50 page-break': index !== 0 && index % 2 === 0 }"
            v-for="(value, key, index) in allData?.cluster_fig_data" :key="index">
            <img :src="`${value}`" />
            <div class="img-title">图3-{{ index + 1 }}. {{ key }} 的波形图和拓扑图</div>
          </div>
        </div>

        <!-- 测试用的 -->
        <!-- <div class="cluster-img-list">
          <div class="mb100" :class="{ 'pt50 page-break': index !== 0 && index % 2 === 0 }"
            v-for="(value, key, index) in 5" :key="index">
            <img :src="testimg" />
            <div class="img-title">图3-{{ index + 1 }}. {{ key }} 的波形图和拓扑图</div>
          </div>
        </div> -->

      </div>
    </div>

  </a-card>
  <!-- </div> -->

  <a-back-top class="back-top-btn" />
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import html2pdf from 'html2pdf.js'
import { previewImg } from '@u/preview'  // 查看大图

import ListView from './ListView.vue'
import ListViewImg from './ListViewImg.vue'

import report_bg from '@img/report/report_bg.png'
import subinfo from '@img/report/subinfo.svg'
import meginfo from '@img/report/meginfo.svg'
import summary from '@img/report/summary.svg'
import iconBrain from '@img/report/brain.svg'

import testimg from './testimg.png' // 测试用的

import {
  getReportDataApi, // 25.  获取报告数据
} from '@/api/meg'

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
const themeStore = useThemeStore()
const { isScrollTop } = storeToRefs(themeStore)

import { SYSTEM_NAME } from '@/utils/config'

const { t } = useI18n()

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))

const pageTitle = ref<string[]>([t('溯源分析报告'), megId.value || '请先选择患者'])
document.title = `${t('溯源分析报告')} | ${megId.value}`

const pageRef = ref(null)

const allData = ref<any>(null) // 这里必须是null，不能是{}，配合html里的allData?.
const loading = ref<boolean>(false)
const brainRegionList = ['LT', 'RT', 'LP', 'RP', 'LO', 'RO', 'LF', 'RF', 'Manual'] // 表头，也是脑区列表


onMounted(() => {
  getData()
})

const nowTime = ref<number>()
// 获取报告数据
async function getData() {

  nowTime.value = new Date().getTime()
  // console.log('nowTime :>> ', nowTime.value);
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getReportDataApi(params)
  loading.value = false
  if (code === 200) {
    if (data && JSON.stringify(data) !== '{}') {
      // 添加一个手动标注的数据
      data.ied_data.ied_brain_stat['Manual'] = { num: data.ied_data.manual_spikes_num || 0, percent: '-' }

      // 给所有图片加上时间戳，防止缓存
      if (data.cluster_fig_data) {
        Object.entries(data.cluster_fig_data).forEach((item: any) => {
          data.cluster_fig_data[item[0]] = item[1] + '?t=' + nowTime.value
        })
      }
      if (data.coreg_data) {
        if (data.coreg_data.fiducials_fig) {
          data.coreg_data.fiducials_fig = data.coreg_data.fiducials_fig + '?t=' + nowTime.value
        }
        if (data.coreg_data.coreg_result) {
          data.coreg_data.coreg_result = data.coreg_data.coreg_result + '?t=' + nowTime.value
        }
      }
      if (data.ied_data) {
        if (data.ied_data.seg_ied_dist) {
          // Object.entries(data.ied_data.seg_ied_dist).forEach((item: any) => {
          //   data.ied_data.seg_ied_dist[item[0]] = item[1] + '?t=' + nowTime.value
          // })

          data.ied_data.seg_ied_dist.forEach((item: any) => {
            item.fig_url = item.fig_url + '?t=' + nowTime.value
          })
        }
      }

      allData.value = data
    } else {
      message.error('报告已失效')
      allData.value = null
    }
  }
}


// 下载
function onDownload() {
  const element = document.getElementById('new-report-page');
  const opt = {
    margin: 0, // 没有页边距
    filename: `${megId.value}_${t('溯源分析报告')}.pdf`,
    pagebreak: {
      before: '.page-break', // 根据 .page-break这个class类分页
    },
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      // imageTimeout: 5000, // 设置图像加载的超时时间为30秒
    },
    jsPDF: {
      unit: 'in', // in英寸
      format: 'A4',

      // unit: 'px',
      // format: [800,1131],

      orientation: 'portrait',
    }
  };

  html2pdf().from(element).set(opt).save();

}

const listViewRef = ref(null)

const leftScreenshot = ref(null)
const screenshot3D = ref(null)
const screenshotList = ref([])


const isGetting = ref(false) // 正在下载报告中
const showBottomPage = ref(false) // 显示底部用于下载的页面

// 获取截图前先清空
function getScreenshot() {

  showBottomPage.value = true

  isGetting.value = true
  leftScreenshot.value = null
  screenshot3D.value = null
  screenshotList.value = []
  listViewRef.value.getScreenshot()

  setTimeout(() => {
    if (!screenshot3D.value || !screenshotList.value.length) {
      isGetting.value = false
      message.info('等待结构像加载成功后再试')
      listViewRef.value.restartView()
    }
  }, 5000)
}

// 拿到左侧的截图
function getLeftScreenshot(screenshot: string) {
  leftScreenshot.value = screenshot
}

// A 项目中的脚本
window.addEventListener('message', (event) => {
  // // 验证 event.origin 是否是你期望的源
  // if (event.origin !== 'http://b.example.com') return; // 假设 B 项目的源是 http://b.example.com

  // console.log('Received message:', event.data);


  // 这里接收到来自 B 项目的3D的截图
  if (event.data.type === 'screenshot3D') {
    const screenshot = event.data.screenshot
    screenshot3D.value = screenshot
  }
  // 这里接收到来自 B 项目3个切片的截图
  if (event.data.type === 'screenshotList') {
    const screenshot = event.data.screenshot
    screenshotList.value.push(screenshot)
  }
});


// 触发条件，当a有值并且b有值并且c数组的长度为3时，触发某事件
watch([() => leftScreenshot.value, () => screenshot3D.value, () => screenshotList.value], ([newA, newB, newC]) => {
  if (newA && newB && newC.length === 3) {
    // console.log('全部拿到 :>> ')
    isGetting.value = false
    onDownload()
  }
}, { deep: true })

// 测试用的：
// // 触发条件，当a有值并且b有值并且c数组的长度为3时，触发某事件
// watch([() => leftScreenshot.value], ([newA]) => {
//   if (newA) {
//     console.log('全部拿到2 :>> ')
//     isGetting.value = false
//     onDownload();
//   }
// }, { deep: true });

</script>

<style lang="less" scoped>
@--color-primary: #235cac;


.bg-gray-line {
  background: #fff;
  // background: red;
  width: 100%;
  height: 1px;
}

// .page-break {
//   border-top: 1px solid blue;
// }

// 页面根class
.main-page {
  position: relative;

  .page-top {
    width: 800px;
    margin: 0 auto;
    margin-bottom: 12px;
    box-shadow: var(--box-shadow);
  }

  .page-top-fixed {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    z-index: 999;
  }
}


@width: 800px;

// @ratio: 800 / 1200;

.card-page {
  transform-origin: top;
  transform: scale(1);
  width: @width;
  margin: 0 auto 16px;
  color: var(--color-t2);

  position: relative;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;

  :deep(.ant-card-body) {
    padding: 0;
  }
}

// .page-content {

//   >div {
//     margin-bottom: 30px;
//   }
// }

.big-margin {
  margin-bottom: 30px;
}

.main-title-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  // top: 130px;
  // width: 478px;
  // height: 187px;

  // top: 117px;
  // width: 424px;
  // height: 164px;


  top: @width * 0.14625;
  width: @width * 0.53;
  height: @width * 0.224;

  letter-spacing: 1.4px;
  color: @--color-primary;

  // border: 1px solid ;

  // border-radius: 16px;
  // border: 1.5px solid rgba(35, 92, 172, 0.38);
  // background: rgba(35, 92, 172, 0.01);
  // backdrop-filter: blur(8.34px);
  // -webkit-backdrop-filter: blur(8.34px);


  &:before {
    content: '';
    position: absolute;
    top: 23px;
    left: 22px;
    width: 5px;
    height: 28px;
    border-radius: 2px;
    background: rgba(35, 92, 172, 0.68);
  }


  .main-title {
    width: calc(100% - 70px);
    position: absolute;
    top: 20px;
    left: 50px;
    word-break: break-all;
    font-size: 24px;
    font-weight: 600;
  }

  .sub-title {
    text-align: right;
    position: absolute;
    bottom: 48px;
    right: 20px;
    font-size: 22px;
    font-weight: 500;
  }

  .time {
    position: absolute;
    bottom: 16px;
    right: 20px;
    font-size: 17px;
    font-weight: 500;
    color: rgba(35, 92, 172, 0.60);
  }
}

.content-padding {
  // padding: 10px 80px 30px 80px;
  padding: 10px 60px 30px 60px;
}

@width_hide: 800px;

.card-page-hide {
  transform-origin: top;
  transform: scale(1);
  width: @width_hide;

  #new-report-page {

    .main-title-box {
      // top: 117px;
      // width: 424px;
      // height: 164px;

      top: @width_hide * 0.14625;
      width: @width_hide * 0.53;
      height: @width_hide * 0.224;
    }

    .content-padding {
      padding: 10px 40px 30px 40px;
    }
  }
}

.small-title {
  width: 100%;
  padding: 3px;
  font-size: 18px;
  font-weight: 600;
  color: @--color-primary;
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 8px;
  letter-spacing: 1px;

  .icon {
    width: 28px;
    height: 28px;
    margin-right: 12px;
  }
}

.small-title-bg {
  width: fit-content;
  padding: 3px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: @--color-primary;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  height: 40px;
  padding: 0 8px;
  letter-spacing: 1px;

  .icon {
    width: 25px;
    height: 25px;
    margin-right: 12px;
  }

  &::after {
    content: "";
    display: block;
    border: 20px solid transparent;
    border-left: 20px solid @--color-primary; //朝上
    position: absolute;
    top: 50%;
    // right: -40px;
    right: -39.9px;
    transform: translateY(-50%);
  }

}

.img-title {
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(1, 4, 9, 0.89);
  word-break: break-all;
  line-height: 1.3;
}

.wdithP100 {
  width: 100%;
}



.list {
  font-size: 15px;
  border-radius: 8px;
  overflow: hidden;

  .header,
  .item {
    height: 46px;
    display: flex;
    align-items: stretch;
    justify-content: center;

    >div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      &:not(:last-child) {
        margin-right: 1px;
      }
    }
  }

  .header {
    >div {
      color: #fff;
      background: @--color-primary;
    }
  }

  .item {
    border-top: 1px solid #fff;

    >div {
      color: rgba(1, 4, 9, 0.89);
      background: rgba(35, 92, 172, 0.05);
    }

    &.item-bg-white {
      >div {
        background: rgba(35, 92, 172, 0.01);
      }
    }
  }

  // IED数量分布的第一列，字太长，稍微宽一点
  &.ied-list {

    .header,
    .item {
      >div:first-child {
        flex: 1.5;
      }
    }
  }
}

img {
  width: 100%;
  height: 100%;
}

.summary {
  font-size: 15px;
  font-weight: 600;
  background: rgba(35, 92, 172, 0.05);
  color: #010409;
  padding: 16px 0 16px 16px;
  border-radius: 8px;
}


.zoom-in {
  cursor: zoom-in;
}

.coreg-img-list {
  img {
    width: 678px;
    height: 227px;
  }
}

.ied-img-list {
  margin-top: 30px;

  >div {
    width: calc(50% - 8px); // 配合ml4 mr4来的
    height: 280px; //A4纸的高度约是 1131.43px。 1131.43px/4=228.85px, 调试后发现280px适合，但每页最后2个高度的282px;
    // border: 1px solid red;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;


    &:nth-child(2n+1) {
      margin-right: 8px;
    }

    &:nth-child(2n) {
      margin-left: 8px;
    }


    // 前4个高度固定住，不要受其他的影响
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      height: 280px;

      img {
        margin-top: -22px;
      }
    }

    // :class="{ 'mt16': index === 4 || index === 5 || index === 12 || index === 13 || index === 20 || index === 21  }"


    // 这都是每页的最后2个，高度额外高一点，整好8个撑满1页。
    &:nth-child(11),
    &:nth-child(12),
    &:nth-child(19),
    &:nth-child(20),
    &:nth-child(27),
    &:nth-child(28) {
      height: 282px;
    }

    // 只有一个时，这一个会撑满宽度。
    &.widthP100 {
      width: 100%;
      height: 505px;
      margin: 0;

      img {
        width: 662px;
        height: 444px;
      }
    }

  }

  img {
    width: 331px;
    height: 222px;
  }

}

.cluster-img-list {
  img {
    width: 678px;
    height: 339px;
  }
}

.coreg-img-list,
.cluster-img-list {
  .img-title {
    margin-top: 16px;
  }
}

.two-cards {
  display: flex;
}


.mt40 {
  margin-top: 40px;
}

.mb100 {
  margin-bottom: 100px;
}

.pt50 {
  padding-top: 50px;
}

.left-top {
  position: absolute;
  top: 20px;
  left: 25px;
  color: @--color-primary;
  display: flex;
  align-items: center;
  letter-spacing: 0.8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;

  .logo {
    font-size: 22px;
    margin-right: 12px;
  }
}
</style>

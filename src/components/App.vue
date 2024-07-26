<template>
  <drag-and-drop enabled @drop-files="loadFiles" id="app-container">
    <template v-slot="{ dragHover }">
      <v-app>

        <!-- GGG 注释<app-bar -->
        <!-- <app-bar @click:left-menu="leftSideBar = !leftSideBar"></app-bar> -->

        <!-- <v-navigation-drawer 不能注释，否则切换新图像就失败。 在\src\plugins\vuetify.js 修改lg:1024 => 10240即可 -->
        <v-navigation-drawer
          v-model="leftSideBar"
          app
          clipped
          touchless
          width="450"
          id="left-nav"
        >
          <module-panel @close="leftSideBar = false" />
        </v-navigation-drawer>



        <v-main id="content-main">
          <div class="fill-height d-flex flex-row flex-grow-1">
            <controls-strip :has-data="hasData"></controls-strip>
            <div class="d-flex flex-column flex-grow-1">
              <layout-grid v-show="hasData" :layout="layout" />
              <welcome-page
                v-if="!hasData"
                :loading="showLoading"
                class="clickable"
                >
                <!-- @click="loadUserPromptedFiles" -->
                <!-- @click="loadUserPromptedFiles" -->
              </welcome-page>
            </div>
          </div>
        </v-main>
        <keyboard-shortcuts />
      </v-app>
      <persistent-overlay
        :disabled="!dragHover"
        color="#000"
        :opacity="0.3"
        :z-index="2000"
        class="text-center"
      >
        <div class="d-flex flex-column align-center justify-center h-100">
          <div class="dnd-prompt">
            <v-icon size="4.75rem">mdi-download</v-icon>
            <div class="text-h2 font-weight-bold">Drop your files to open</div>
          </div>
        </div>
      </persistent-overlay>
    </template>
  </drag-and-drop>
</template>

<script lang="ts">
import type { Vector3 } from '@kitware/vtk.js/types';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { UrlParams, createEventHook } from '@vueuse/core';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';
import { useDisplay } from 'vuetify';
import useLoadDataStore from '@/src/store/load-data';
import { useViewStore } from '@/src/store/views';
import useRemoteSaveStateStore from '@/src/store/remote-save-state';
// import AppBar from '@/src/components/AppBar.vue';
import ControlsStrip from '@/src/components/ControlsStrip.vue';
import {
  loadFiles,
  loadUserPromptedFiles,
  loadUrls,
} from '@/src/actions/loadUserFiles';
import WelcomePage from '@/src/components/WelcomePage.vue';
import { useDICOMStore } from '@/src/store/datasets-dicom';
import LayoutGrid from '@/src/components/LayoutGrid.vue';
import ModulePanel from '@/src/components/ModulePanel.vue';
import DragAndDrop from '@/src/components/DragAndDrop.vue';
import PersistentOverlay from '@/src/components/PersistentOverlay.vue';
import KeyboardShortcuts from '@/src/components/KeyboardShortcuts.vue';
import { useImageStore } from '@/src/store/datasets-images';
import { useServerStore } from '@/src/store/server';
import { useGlobalErrorHook } from '@/src/composables/useGlobalErrorHook';
import { useKeyboardShortcuts } from '@/src/composables/useKeyboardShortcuts';


const clickEventSetPosition = createEventHook<[Vector3,boolean]>();
export function useSetPositionEvents() {
  return { onClick: clickEventSetPosition.on };
}

const clickEventSetPositionList = createEventHook<[Vector3[],boolean]>();
export function useSetPositionListEvents() {
  return { onClick: clickEventSetPositionList.on };
}

const clickEventSetPositionListWithColor = createEventHook<[Vector3[],boolean]>();
export function useSetPositionListWithColorEvents() {
  return { onClick: clickEventSetPositionListWithColor.on };
}



// B项目接收
window.addEventListener('message', (event) => {
  // console.log('message :>> ', event)

  if (event.data.type === 'file') {
    const fileUrl = event.data.fileUrl
    const filePath = event.data.filePath
    // 使用fileUrl获取Blob并处理
    // 从Blob URL创建新的Blob对象
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const fileName = filePath; // 文件名
        const mimeType = '';       // MIME类型
        // const mimeType = 'application/vnd.unknown.nifti-1'; // MIME类型
        // 创建一个新的File对象
        const file = new File([blob], fileName, {type: mimeType});
        // console.log('B file :>> ', file);
        // 现在你可以像处理本地文件一样处理这个File对象
        loadFiles([file])
      })
      .catch(error => console.error('Failed to load blob:', error))
  }


  if (event.data.type === 'position') {
    const position: Vector3 = event.data.position.split(',')
    const change: boolean = event.data.change
    // console.log('position string[]', position);
    clickEventSetPosition.trigger([position, change]);
  }

  if (event.data.type === 'setPositionList') {
    const positionList: Vector3[] = JSON.parse(event.data.positionList)
    // console.log('positionList number[][]', positionList);
    const change: boolean = event.data.change
    clickEventSetPositionList.trigger([positionList, change]);
  }

  if (event.data.type === 'setPositionListWithColor') {
    const positionList: any = JSON.parse(event.data.positionList)
    // console.log('positionList number[][]', positionList);
    const change: boolean = event.data.change
    clickEventSetPositionListWithColor.trigger([positionList, change]);
  }

})


console.log('VolView0726')

// setTimeout(()=>{
//   console.log('开始设置position');
//   const position: Vector3 = [80,150,200]
//   clickEventSetPosition.trigger(position);
// },10000)


// // 生成一个随机数
// function randomNum(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min) + min)
// }
// // 生成一个随机位置
// function randomPosition(){
//   const position: Vector3 = [
//     randomNum(50,200),
//     randomNum(50,200),
//     randomNum(50,200)
//   ]
//   return position
// }

// // // 生成一个位置
// setInterval(()=>{
//   const position: Vector3 = randomPosition()
//   // const position: Vector3 = [1,1,1]
//   // const position: Vector3 = [10,10,10]
//   console.log('开始设置position', position);
//   clickEventSetPosition.trigger(position);
// },10000)


// // 生成多个位置
// setInterval(()=>{
// // setTimeout(()=>{
//   const positionList: Vector3[] = []
//   // const length = Math.floor(randomNum(5,5))
//   // for (let index = 0; index < length; index++) {
//   //   positionList.push(randomPosition())
//   // }

//   positionList.push([192,512,512])
//   positionList.push([96,256,256]) // 这是中心点
//   positionList.push([0,0,0])
//   // positionList.push([256,256,256]) //
//   // positionList.push([128,128,128]) // 这是中心点

//   // console.log('开始设置positionList', positionList);
//   clickEventSetPositionList.trigger(positionList);
// },8000)


// // 生成多个位置，带有颜色的。
// setInterval(()=>{
// // setTimeout(()=>{
//   // const positionList: Vector3[] = []
//   // // const length = Math.floor(randomNum(5,5))
//   // // for (let index = 0; index < length; index++) {
//   // //   positionList.push(randomPosition())
//   // // }

//   // // positionList.push([192,512,512])
//   // // positionList.push([96,256,256]) // 这是中心点
//   // positionList.push([0,0,0])
//   // // positionList.push([256,256,256]) //
//   // positionList.push([128,128,128]) // 这是中心点

//   // console.log('开始设置positionList', positionList);
//   // clickEventSetPositionListWithColor.trigger(positionList);
//   // clickEventSetPositionListWithColor.trigger({
//   //   'red':[[0,0,0],[128,128,128]],
//   //   'green':[[10,10,10],[118,118,118]],
//   // });


//   clickEventSetPositionListWithColor.trigger({
//     'red':[[60,-30,55]],
//     'green':[[60,55,30]],
//     // 'green':[[10,10,10],[118,118,118]],
//   });

// },8000)



export default defineComponent({
  name: 'App',

  components: {
    ControlsStrip,
    LayoutGrid,
    DragAndDrop,
    ModulePanel,
    PersistentOverlay,
    KeyboardShortcuts,
    WelcomePage,
    // AppBar,
  },

  setup() {
    const imageStore = useImageStore();
    const dicomStore = useDICOMStore();

    useGlobalErrorHook();
    useKeyboardShortcuts();

    // --- file handling --- //

    const loadDataStore = useLoadDataStore();
    const hasData = computed(
      () =>
        imageStore.idList.length > 0 ||
        Object.keys(dicomStore.volumeInfo).length > 0
    );
    // show loading if actually loading or has any data,
    // since the welcome screen shouldn't be visible when
    // a dataset is opened.
    const showLoading = computed(
      () => loadDataStore.isLoading || hasData.value
    );

    // --- parse URL -- //

    const urlParams = vtkURLExtract.extractURLParameters() as UrlParams;

    onMounted(() => {
      // console.log('B onMounted')
      if (!urlParams.urls) {
        return;
      }

      loadUrls(urlParams);
    });

    // --- remote server --- //

    const serverStore = useServerStore();

    onMounted(() => {
      serverStore.connect();
    });

    // --- save state --- //

    if (import.meta.env.VITE_ENABLE_REMOTE_SAVE && urlParams.save) {
      // Avoid dropping JSON or array query param arguments on the "save" query parameter
      // by parsing query params without casting to native types in vtkURLExtract.
      const queryParams = new URLSearchParams(window.location.search);
      const saveUrl = queryParams.get('save');
      if (saveUrl) {
        useRemoteSaveStateStore().setSaveUrl(saveUrl);
      }
    }

    // --- layout --- //

    const { layout } = storeToRefs(useViewStore());

    // --- //

    const display = useDisplay();

    return {
      leftSideBar: ref(!display.mobile.value),
      loadUserPromptedFiles,
      loadFiles,
      hasData,
      showLoading,
      layout,
    };
  },
});
</script>

<style>
#content-main {
  /* disable v-content transition when we resize our app drawer */
  transition: initial;
  width: 100%;
  height: 100%;
  position: fixed;
}

#left-nav {
  border-right: 1px solid rgb(var(--v-theme-background));
}

#content-main > .v-content__wrap {
  display: flex;
}

#module-switcher .v-input__prepend-inner {
  /* better icon alignment */
  margin-top: 15px;
}

.alert > .v-snack__wrapper {
  /* transition background color */
  transition: background-color 0.25s;
}
</style>

<style src="@/src/components/styles/utils.css"></style>

<style scoped>
#app-container {
  width: 100%;
  height: 100%;
}

.dnd-prompt {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.4);
  padding: 64px;
}
</style>

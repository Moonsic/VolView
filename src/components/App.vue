<template>
  <drag-and-drop enabled @drop-files="loadFiles" id="app-container">
    <template v-slot="{ dragHover }">
      <v-app>

        <!-- GGG 注释<app-bar和<v-navigation-drawer -->
        <app-bar @click:left-menu="leftSideBar = !leftSideBar"></app-bar>
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
import { computed, defineComponent, onMounted, provide, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { UrlParams } from '@vueuse/core';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';
import { useDisplay } from 'vuetify';
import useLoadDataStore from '@/src/store/load-data';
import { useViewStore } from '@/src/store/views';
import useRemoteSaveStateStore from '@/src/store/remote-save-state';
import AppBar from '@/src/components/AppBar.vue';
import ControlsStrip from '@/src/components/ControlsStrip.vue';
import {
  loadFiles,
  loadUserPromptedFiles,
  loadUrls,
} from '@/src/actions/loadUserFiles';
import vtkResliceCursorWidget, {
  ResliceCursorWidgetState,
} from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget';
import { useCurrentImage } from '@/src/composables/useCurrentImage';
import type { Vector3 } from '@kitware/vtk.js/types';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
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
import { useWebGLWatchdog } from '@/src/composables/useWebGLWatchdog';
import { useKeyboardShortcuts } from '@/src/composables/useKeyboardShortcuts';
import { VTKResliceCursor } from '@/src/constants';

// B项目接收
window.addEventListener('message', (event) => {
  console.log('message :>> ', event)

  // if (event.data.filePath) {
  //   const filePath = event.data.filePath
  //   const url = `/api/sl/getNiiFileStream?filePath=${filePath}`
  //   const xhr = new XMLHttpRequest();
  //   // POST请求,link,async(是否异步)
  //   xhr.open("GET", url, true);
  //   // //设置请求头参数的方式,如果没有可忽略此行代码
  //   const accessToken = String(localStorage.getItem('access_token'))
  //   console.log('access_token :>> ',accessToken );
  //   xhr.setRequestHeader("Authentication", accessToken);
  //   // //设置响应类型为 blob
  //   xhr.responseType = "blob";
  //   // //关键部分
  //   xhr.onload = function() {
  //     console.log('B this :>> ', this);
  //     //   //如果请求执行成功
  //     if (this.status === 200) {
  //       const blob = this.response;
  //       // const blob = new Blob([res], { type: '' })
  //       const newFile = new File([blob], filePath)
  //       console.log('B newFile :>> ', newFile);
  //       loadFiles([newFile])
  //     }
  //   };
  //   // //发送请求
  //   xhr.send();
  // }











  if (event.data.type === 'file') {
    const fileUrl = event.data.fileUrl
    const filePath = event.data.filePath
    // 使用fileUrl获取Blob并处理
    // 从Blob URL创建新的Blob对象
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {

        const fileName = filePath; // 文件名
        const mimeType = ''; // MIME类型
        // const mimeType = 'application/vnd.unknown.nifti-1'; // MIME类型

        // 创建一个新的File对象
        const file = new File([blob], fileName, {type: mimeType});
        console.log('B file :>> ', file);
        // 现在你可以像处理本地文件一样处理这个File对象
        loadFiles([file])

        // // 现在你有了Blob对象，可以进行进一步处理，例如：
        // const fileReader = new FileReader()
        // fileReader.onload = (e) => {
        //   console.log('e :>> ', e)
        //   // 文件内容已加载到内存中
        //   const result = e.target.result;
        //   console.log('result :>> ', result)
        //   // 根据文件类型进行处理，例如图像、文档、音频等
        //   loadFiles([result])
        // }
        // fileReader.readAsArrayBuffer(blob) // 或者 readAsText/blob()，取决于你需要什么格式的数据





      })
      .catch(error => console.error('Failed to load blob:', error))
  }
})

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
    AppBar,
  },

  setup() {
    const imageStore = useImageStore();
    const dicomStore = useDICOMStore();

    useGlobalErrorHook();
    useWebGLWatchdog();
    useKeyboardShortcuts();

    const { currentImageData, currentImageMetadata } = useCurrentImage();

    // --- ResliceCursorWidget --- //
    // Construct the common instance of vtkResliceCursorWidget and provide it
    // to all the child ObliqueView components.
    const resliceCursor = vtkResliceCursorWidget.newInstance({
      scaleInPixels: true,
      rotationHandlePosition: 0.75,
    }) as vtkResliceCursorWidget;
    provide(VTKResliceCursor, resliceCursor);

    // TODO: Move this to a store/global-state for reslicing.
    // Orient the planes of the vtkResliceCursorWidget to the orientation
    // of the currently set image.
    const resliceCursorState =
      resliceCursor.getWidgetState() as ResliceCursorWidgetState;

    // Temporary fix to disable race between PanTool and ResliceCursorWidget
    resliceCursorState.setScrollingMethod(-1);

    watch(currentImageData, (image) => {
      if (image && resliceCursor) {
        resliceCursor.setImage(image);
        // Reset to default plane values before transforming based on current image-data.
        resliceCursorState.setPlanes({
          [ViewTypes.YZ_PLANE]: {
            normal: [1, 0, 0],
            viewUp: [0, 0, 1],
          },
          [ViewTypes.XZ_PLANE]: {
            normal: [0, -1, 0],
            viewUp: [0, 0, 1],
          },
          [ViewTypes.XY_PLANE]: {
            normal: [0, 0, -1],
            viewUp: [0, -1, 0],
          },
        });
        const planes = resliceCursorState.getPlanes();
        if (currentImageMetadata.value) {
          planes[ViewTypes.XY_PLANE].normal = currentImageMetadata.value
            .lpsOrientation.Inferior as Vector3;
          planes[ViewTypes.XY_PLANE].viewUp = currentImageMetadata.value
            .lpsOrientation.Anterior as Vector3;

          planes[ViewTypes.XZ_PLANE].normal = currentImageMetadata.value
            .lpsOrientation.Anterior as Vector3;
          planes[ViewTypes.XZ_PLANE].viewUp = currentImageMetadata.value
            .lpsOrientation.Superior as Vector3;

          planes[ViewTypes.YZ_PLANE].normal = currentImageMetadata.value
            .lpsOrientation.Left as Vector3;
          planes[ViewTypes.YZ_PLANE].viewUp = currentImageMetadata.value
            .lpsOrientation.Superior as Vector3;
        }
      }
    });

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
      console.log('B onMounted')
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

    const remoteSaveStateStore = useRemoteSaveStateStore();
    if (import.meta.env.VITE_ENABLE_REMOTE_SAVE && urlParams.save) {
      remoteSaveStateStore.setSaveUrl(urlParams.save.toString());
    }

    // --- layout --- //

    const { layout } = storeToRefs(useViewStore());
console.log('layout',layout)
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

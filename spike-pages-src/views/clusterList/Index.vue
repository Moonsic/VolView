<!--  -->
<template>
  <div class="main-page">
    <div class="page-top">
      <Back class="page-back" :title="pageTitle" :showArrow="true" />
    </div>

    <div class="page-bottom">
      <div class="left">
        <TheFolder ref="folderRef" @selectFolder="selectFolder" />
      </div>
      <div class="right">
        <TheList ref="listRef" @refreshFolderList="refreshFolderList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import TheFolder from './Folder.vue'
import TheList from './List.vue'

// 可分页的列表
// import List from './ListScroll.vue'

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const pageTitle = ref<string[]>(['聚类列表', megId.value || '请先选择患者'])
document.title = `聚类列表 | ${megId.value}`


const folderRef = ref(null)
const listRef = ref(null)

// 点击左侧列表后
function selectFolder(res: any) {
  listRef.value.selectFolder(res)
}

// 刷新列表
function refreshFolderList(res: any) {
  folderRef.value.refreshFolderList(res)
}

</script>

<style lang='less' scoped>
.main-page {

  .page-top {
    margin-bottom: 16px;
    box-shadow: var(--box-shadow);
  }

  .page-bottom {
    display: flex;
    height: calc(100vh - 58px - 16px - 230px - 16px);
    // min-height: calc(100vh - 58px - 12px - @margin - @margin);
    // position: relative;

    .left {
      width: 250px;
      min-width: 250px;
      padding: 16px;
      margin-right: 16px;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
      border-radius: 18px;
      box-shadow: var(--box-shadow);
      background: var(--color-bg);
      border: var(--border-card);
    }

    .right {
      width: calc(100% - 250px - 16px);
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      border-radius: 18px;
    }
  }
}
</style>
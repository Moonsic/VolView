<template>
  <div class="title">{{ t('请上传 zip 格式的压缩包，格式如下：') }}</div>

  <!-- <img class="img" :src="format" alt=""> -->

  <pre>

<span class="text-bold"><IconFolder class="mr4" :style="{ color: 'var(--color-folder)' }" />sub-01</span>
     |
     |---- <span class="text-bold"><IconFolder class="mr4" :style="{ color: 'var(--color-folder)' }" />anat</span>
     |       |----- example.nii
     |       |----- slices（{{ t('如果是DICOM类型，需要将切片保存到slices目录中')}}）
     |                |----- slice-01
     |                |----- slice-02
     |                |----- .......
     |
     |---- <span class="text-bold"><IconFolder class="mr4" :style="{ color: 'var(--color-folder)' }" />meg</span>
            |----- example-01.fif
            |----- example-02.fif
            |----- .......
  </pre>
</template>

<script lang="ts" setup>
// import format from './format.png'
const { t } = useI18n()
</script>

<style lang="less" scoped>
.title {
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: var(--border);

  &:before {
    content: '';
    display: inline;
    border-left: 4px solid var(--color-modal-title-before);
    border-right: 4px solid var(--color-modal-title-before);
    border-radius: 2px;
    margin-right: 16px;
  }
}

.img {
  width: 450px;
}
</style>
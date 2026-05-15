<template>
  <a-upload v-show="false" ref="hiddenUploadRef" v-model:file-list="fileList" name="file" :accept="props.accept"
    :showUploadList="false" :before-upload="beforeUploadFile" @change="onFileSelected">
  </a-upload>
</template>

<script lang="ts" setup>

const props = defineProps({
  accept: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success']);

const fileList = ref([])
// 上传单个文件
function beforeUploadFile(file: File) {
  setTimeout(() => {
    fileList.value = []
  })
  return false
}

function onFileSelected({ file }: { file: File }) {
  // 当文件被选择时触发
  emit('success', file)
}

const hiddenUploadRef = ref()
function clickUpload() {
  // 通过 ref 访问隐藏的上传组件的 input 元素并触发 click 事件
  const inputElement = hiddenUploadRef.value?.$el.querySelector('input[type=file]')
  if (inputElement) {
    inputElement.click()
  }
}

function upload() {
  clickUpload()
}

// 暴露方法
defineExpose({
  upload
})

</script>

<style lang="less" scoped></style>

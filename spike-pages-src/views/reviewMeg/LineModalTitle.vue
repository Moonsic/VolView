<template>

  <!-- <div v-if="listNameType === 'listName'" :title="listName">
    {{ listName }}
  </div>
  <template v-if="listNameType === 'chNames'">
    <div v-if="['meg'].includes(paramsData.modalType)" :title="[...paramsData.chNames, ...ecgeoggfpList].join()">
      {{ paramsData.chNames.length > 1 ? `${paramsData.chNames[0]}...` : paramsData.chNames[0] }}
    </div>
    <div v-if="['eegChannel'].includes(paramsData.modalType)" :title="paramsData.chNames.join()">
      {{ paramsData.chNames.join() }}
    </div>
    <div v-if="['eegComb'].includes(paramsData.modalType)" :title="eegCombData.join()">
      {{ eegCombData.join() }}
    </div>

  </template> -->


  <div class="modal-title">
    <span v-if="listNameType === 'listName'" :title="listName">
      {{ listName }}
    </span>
    <template v-if="listNameType === 'chNames'">
      <span v-if="['meg'].includes(paramsData.modalType)" :title="[...paramsData.chNames, ...ecgeoggfpList].join()">
        {{ paramsData.chNames.length > 1 ? `${paramsData.chNames[0]}...` : paramsData.chNames[0] }}
        <!-- {{ `${paramsData.chNames[0]}${paramsData.chNames.length > 1 ? '...' : ''}` }} -->
      </span>
      <span v-if="['eegChannel'].includes(paramsData.modalType)" :title="paramsData.chNames.join()">
        {{ paramsData.chNames.join() }}
      </span>
      <span v-if="['eegComb'].includes(paramsData.modalType)" :title="paramsData.leadCombination.join()">
        {{ paramsData.leadCombination.join() }}
      </span>
    </template>
  </div>

  <div class="modal-type">
    <span v-if="['ecgeog', 'gfp'].includes(paramsData.modalType)"> {{ ecgeoggfpList.join() }}</span>
    <template v-if="['meg'].includes(paramsData.modalType)">
      <span v-if="paramsData.chNames.length">MEG</span>
      <span v-else>{{ ecgeoggfpList.join() }}</span>
    </template>
    <span v-if="['eegChannel', 'eegComb'].includes(paramsData.modalType)"> EEG</span>
  </div>

</template>

<script lang="ts" setup>

const props = defineProps({
  listName: {
    type: String,
    default: '',
  },
  listNameType: {
    type: String,
    default: '',
  },
  paramsData: {
    type: Object as PropType<any>,
    default: [],
  },
})

const ecgeoggfpList = computed(() => {
  const list: any = []
  if (props.paramsData.isEcg) {
    list.push('ECG')
  }
  if (props.paramsData.isEog) {
    list.push('EOG')
  }
  if (props.paramsData.isGfp) {
    list.push('GFP')
  }
  return list
})

// 以前对象的写法，现在改成数组
// const eegCombData = computed(() => {
//   const list: any = []
//   Object.entries(props.paramsData.leadCombination).forEach(([key, value]) => {
//     list.push(key + '-' + value)
//   })
//   return list
// })

</script>

<style lang="less" scoped>
.modal-title {
  width: 52%;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.modal-type {
  width: 48%;

  >span {
    display: inline-block;
    padding: 2px 4px;
    color: var(--black-t3);
    border: 1px solid var(--black-t5);
    border-radius: 3px;
    line-height: 1;
  }
}

.chart-dark {
  .modal-type {
    >span {
      color: var(--white-t3);
      border: 1px solid var(--white-t5);
    }
  }
}

.chart-eyecare {
  .modal-type {
    >span {
      color: var(--eyecare-t3);
      border: 1px solid var(--eyecare-t5);
    }
  }
}
</style>
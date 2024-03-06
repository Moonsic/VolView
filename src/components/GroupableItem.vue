<script lang="ts">
import { computed, inject, defineComponent, toRefs, watch } from 'vue';
import { ItemGroupProvider, ItemGroupProviderValue } from './ItemGroup.vue';

import { useImageStore } from '../store/datasets-images';

export default defineComponent({
  props: {
    value: {
      type: null,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { value } = toRefs(props);
    const itemGroup = inject<ItemGroupProviderValue>(ItemGroupProvider);

    if (!itemGroup) {
      throw new Error('GroupableItem needs ItemGroup!');
    }

    const select = () => {
      console.log('select() value :>> ', value);
      itemGroup.selectItem(value.value);
    };

    const toggle = () => {
      if (!itemGroup) {
        return;
      }

      itemGroup.selectItem(
        itemGroup.isSelected(value.value) ? undefined : value.value
      );
    };

    // GGG 监听nonDICOMImages，手动改成选中最后一个文件
    const imageStore = useImageStore();
    const nonDICOMImages = computed(() =>
      imageStore.idList
    );
    watch(
      nonDICOMImages,
      (imageIDs) => {
        value.value = {type: 'image', dataID: imageIDs[imageIDs.length - 1]}
        console.log('50 watch imageIDs :>> ', imageIDs,value.value);
        itemGroup.selectItem(value.value);
      },
      { immediate: true, deep: true }
    );
    return () =>
      slots.default?.({
        active: itemGroup.isSelected(value.value),
        select,
        toggle,
      });
  },
});
</script>

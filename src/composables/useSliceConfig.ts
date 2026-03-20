import useViewSliceStore, {
  defaultSliceConfig,
} from '@/src/store/view-configs/slicing';
import { Maybe } from '@/src/types';
import type { Vector2 } from '@kitware/vtk.js/types';
import { unref, MaybeRef, computed } from 'vue';

export function useSliceConfig(
  viewID: MaybeRef<string>,
  imageID: MaybeRef<Maybe<string>>
) {
  const store = useViewSliceStore();
  const configDefaults = defaultSliceConfig();
  const config = computed(() => store.getConfig(unref(viewID), unref(imageID)));
// console.log('config :>> ', config);

  const slice = computed({
    get: () => config.value?.slice ?? configDefaults.slice,
    set: (val) => {

      // HHH set里的代码在测滑动条时要考虑注释掉
      const imageIdVal = unref(imageID);
      // console.log('set slice:>> ',viewID,val);

      if (!imageIdVal || val == null) return;
      store.updateConfig(unref(viewID), imageIdVal, { slice: val });

      // Update other synchronized views if any
      if (config.value?.syncState) {
        store.updateSyncConfigs();
      }
    },
  });

  const range = computed((): Vector2 => {
    const { min, max } = config.value ?? {};

    if (min == null || max == null)
      return [configDefaults.min, configDefaults.max];
    return [min, max];
  });

  return { config, slice, range };
}

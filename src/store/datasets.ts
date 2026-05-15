/* eslint-disable import/no-cycle */
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  isDicomImage,
  isRegularImage,
  type DataSelection,
} from '@/src/utils/dataSelection';
import { useDICOMStore } from './datasets-dicom';
import { useImageStore } from './datasets-images';
import { useFileStore } from './datasets-files';
import { StateFile } from '../io/state-file/schema';
import { useErrorMessage } from '../composables/useErrorMessage';
import { useLayersStore } from './datasets-layers';
import useLayerColoringStore from './view-configs/layers';

export const DataType = {
  Image: 'Image',
  Model: 'Model',
};

export const useDatasetStore = defineStore('dataset', () => {
  const imageStore = useImageStore();
  const dicomStore = useDICOMStore();
  const fileStore = useFileStore();
  const layersStore = useLayersStore();
  const layerColoringStore = useLayerColoringStore();

  // --- state --- //

  const primarySelection = ref<DataSelection | null>(null);

  // --- getters --- //

  const primaryImageID = primarySelection;

  // console.log('primaryImageID', primaryImageID)

  const primaryDataset = computed<vtkImageData | null>(() => {
    const { dataIndex } = imageStore;
    return (primaryImageID.value && dataIndex[primaryImageID.value]) || null;
  });

  const idsAsSelections = computed(() => {
    const volumeKeys = Object.keys(dicomStore.volumeInfo);
    const images = imageStore.idList.filter((id) => isRegularImage(id));
    return [...volumeKeys, ...images];
  });

  // --- actions --- //

  function setPrimarySelection(sel: DataSelection | null) {
    // console.log('setPrimarySelection', sel,isDicomImage(sel));
    primarySelection.value = sel;
    if (!sel) return;

    // if selection is dicom, call buildVolume
    if (isDicomImage(sel)) {
      useErrorMessage('Failed to build volume', () =>
        dicomStore.buildVolume(sel)
      );
    }
  }

  async function serialize(stateFile: StateFile) {
    await dicomStore.serialize(stateFile);
    await imageStore.serialize(stateFile);

    if (primarySelection.value) {
      const { manifest } = stateFile;
      manifest.primarySelection = primarySelection.value;
    }
  }

  // 清除某个结构像
  const remove = (id: string) => {
    if (id === primarySelection.value) {
      primarySelection.value = null;
    }

    if (isDicomImage(id)) {
      dicomStore.deleteVolume(id);
    }
    imageStore.deleteData(id);

    fileStore.remove(id);
    layersStore.remove(id);
  };

  // 清除当前结构像
  const removeAll = () => {
    const id = primarySelection.value as string | null;
    primarySelection.value = null;
    if (id && isDicomImage(id)) {
      dicomStore.deleteVolume(id);
    }
    if (id) {
      imageStore.deleteData(id);
      fileStore.remove(id);
      layersStore.remove(id);
    }

    // 共注册页面清空时要把所有 layer 关联和运行时默认外观一起清掉，避免新结构像复用旧 layer。
    layersStore.clearAll();
    layerColoringStore.resetRuntimeDefaults();
  };


  return {
    primaryImageID,
    primarySelection,
    primaryDataset,
    idsAsSelections,
    setPrimarySelection,
    serialize,
    remove,
    removeAll,
  };
});

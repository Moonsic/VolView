import { defineStore } from 'pinia';
import { vec3, mat3, mat4 } from 'gl-matrix';
import { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import type { Bounds } from '@kitware/vtk.js/types';

import { useIdStore } from '@/src/store/id';
// eslint-disable-next-line import/no-cycle
import { useViewStore } from '@/src/store/views';
import { Layouts } from '@/src/config';

import { defaultLPSDirections, getLPSDirections } from '../utils/lps';
import { removeFromArray } from '../utils';
import { StateFile, DatasetType } from '../io/state-file/schema';
import { serializeData } from '../io/state-file/utils';
import { useFileStore } from './datasets-files';
import { ImageMetadata } from '../types/image';

export const defaultImageMetadata = () => ({
  name: '(none)',
  orientation: mat3.create(),
  lpsOrientation: defaultLPSDirections(),
  spacing: vec3.fromValues(1, 1, 1),
  origin: vec3.create(),
  dimensions: vec3.fromValues(1, 1, 1),
  worldBounds: [0, 1, 0, 1, 0, 1] as Bounds,
  worldToIndex: mat4.create(),
  indexToWorld: mat4.create(),
});

interface State {
  id: string; // 只保留一个
  idList: string[]; // list of IDs
  dataIndex: Record<string, vtkImageData>; // ID -> VTK object
  metadata: Record<string, ImageMetadata>; // ID -> metadata
}

export const useImageStore = defineStore('images', {
  state: (): State => ({
    id: '',
    idList: [],
    dataIndex: Object.create(null),
    metadata: Object.create(null),
  }),
  actions: {
    addVTKImageData(name: string, imageData: vtkImageData) {
      console.log('useImageStore addVTKImageData :>> ', name, imageData);

      // GGG 希望永远只有一个文件
      // const id = useIdStore().nextId();
      // this.id = id
      // this.idList =[id];

      // this.dataIndex = {}
      // this.dataIndex[id] = imageData;

      // this.$proxies.addData(id, imageData);

      // this.dataIndex = {}
      // this.metadata[id] = { ...defaultImageMetadata(), name };
      // this.updateData(id, imageData);
      // return id;


      // 原来的，应该是push进数组
      const id = useIdStore().nextId();
      this.id = id
      this.idList.push(id);
      this.dataIndex[id] = imageData;

      this.$proxies.addData(id, imageData);

      this.metadata[id] = { ...defaultImageMetadata(), name };
      this.updateData(id, imageData);
      return id;
    },

    updateData(id: string, imageData: vtkImageData) {
      console.log('updateData :>> ', id, imageData);

      if (id in this.metadata) {
        const metadata: ImageMetadata = {
          name: this.metadata[id].name,
          dimensions: imageData.getDimensions() as vec3,
          spacing: imageData.getSpacing() as vec3,
          origin: imageData.getOrigin() as vec3,
          orientation: imageData.getDirection(),
          lpsOrientation: getLPSDirections(imageData.getDirection()),
          worldBounds: imageData.getBounds(),
          worldToIndex: imageData.getWorldToIndex(),
          indexToWorld: imageData.getIndexToWorld(),
        };

        this.metadata[id] = metadata;
        this.dataIndex[id] = imageData;

        this.$proxies.updateData(id, imageData);
      }
      this.$proxies.updateData(id, imageData);
      this.dataIndex[id] = imageData;

      // GGG 在这里让布局改成默认为Oblique View布局
      const viewStore = useViewStore();
      setTimeout(() => {
          viewStore.setLayout(Layouts['Oblique View'])
      },50)

    },

    deleteData(id: string) {
      if (id in this.dataIndex) {
        delete this.dataIndex[id];
        delete this.metadata[id];
        removeFromArray(this.idList, id);
      }
    },

    async serialize(stateFile: StateFile) {
      const fileStore = useFileStore();
      // We want to filter out volume images (which are generated and don't have
      // input files in fileStore with matching imageID.)
      const dataIDs = this.idList.filter((id) => id in fileStore.byDataID);

      await serializeData(stateFile, dataIDs, DatasetType.IMAGE);
    },
  },
});

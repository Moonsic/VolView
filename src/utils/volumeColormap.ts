import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { useDatasetStore } from '@/src/store/datasets';
import { useImageStore } from '@/src/store/datasets-images';
import { useViewStore } from '@/src/store/views';
import useWindowingStore from '@/src/store/view-configs/windowing';
import useVolumeColoringStore from '@/src/store/view-configs/volume-coloring';
import { MessagePresetNameList } from '@/src/vtk/ColorMaps';

export interface IframeColorPoint {
  x: number;
  rgb: [number, number, number];
}

export interface ApplyCustomVolumeColormapOptions {
  name?: string;
  colorPoints: IframeColorPoint[];
  positionsNormalized?: boolean;
  mappingRange?: [number, number];
}

function normalizeRgbValue(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error('颜色值必须是数字');
  }

  if (value > 1) {
    return Math.max(0, Math.min(1, value / 255));
  }

  return Math.max(0, Math.min(1, value));
}

function getPrimaryImageContext() {
  const datasetStore = useDatasetStore();
  const imageStore = useImageStore();
  const imageID = datasetStore.primaryImageID;

  if (!imageID) {
    throw new Error('当前没有主结构像，无法设置颜色映射');
  }

  const image = imageStore.dataIndex[imageID];
  if (!image) {
    throw new Error('主结构像尚未加载完成，无法设置颜色映射');
  }

  return {
    imageID,
    image,
    imageRange: image.getPointData().getScalars().getRange() as [number, number],
  };
}

function getImageViewIDs() {
  const viewStore = useViewStore();

  return Object.keys(viewStore.viewSpecs);
}

function ensureVolumeColoringConfig(viewID: string, imageID: string) {
  const volumeColoringStore = useVolumeColoringStore();
  const imageStore = useImageStore();
  const image = imageStore.dataIndex[imageID];

  if (!image) {
    throw new Error('找不到对应结构像数据');
  }

  if (!volumeColoringStore.getConfig(viewID, imageID)) {
    volumeColoringStore.resetToDefaultColoring(viewID, imageID, image);
  }
}

function inferInputRange(colorPoints: IframeColorPoint[]) {
  const xs = colorPoints.map((point) => point.x);
  return [Math.min(...xs), Math.max(...xs)] as [number, number];
}

function buildRgbPoints(
  colorPoints: IframeColorPoint[],
  positionsNormalized: boolean,
  inputRange: [number, number]
) {
  const [inputMin, inputMax] = inputRange;
  const inputWidth = inputMax - inputMin || 1;

  return [...colorPoints]
    .sort((left, right) => left.x - right.x)
    .flatMap((point) => {
      const scalar = positionsNormalized
        ? Math.max(0, Math.min(1, point.x))
        : Math.max(0, Math.min(1, (point.x - inputMin) / inputWidth));

      return [scalar, ...point.rgb.map(normalizeRgbValue)];
    });
}

function syncWindowingRange(
  viewIDs: string[],
  imageID: string,
  mappingRange: [number, number]
) {
  const windowingStore = useWindowingStore();
  const [min, max] = mappingRange;
  const width = max - min;
  const level = (min + max) / 2;

  viewIDs.forEach((viewID) => {
    windowingStore.updateConfig(viewID, imageID, {
      width,
      level,
      min,
      max,
      preset: { width, level },
    });
  });
}

export function registerCustomVolumeColormap({
  name = 'VolView-Custom',
  colorPoints,
  positionsNormalized = true,
  mappingRange,
}: ApplyCustomVolumeColormapOptions) {
  if (colorPoints.length < 2) {
    throw new Error('自定义颜色映射至少需要 2 个颜色点');
  }

  const inputRange = positionsNormalized
    ? ([0, 1] as [number, number])
    : mappingRange || inferInputRange(colorPoints);

  const preset = {
    Name: name,
    ColorSpace: 'RGB',
    RGBPoints: buildRgbPoints(colorPoints, positionsNormalized, inputRange),
  };

  if (vtkColorMaps.getPresetByName(name)) {
    vtkColorMaps.removePresetByName(name);
  }
  vtkColorMaps.addPreset(preset);

  return {
    presetName: name,
    mappingRange: mappingRange || (positionsNormalized ? null : inputRange),
  };
}

export function applyVolumeColormapPreset(
  presetName: string,
  mappingRange?: [number, number]
) {
  if (!vtkColorMaps.getPresetByName(presetName)) {
    throw new Error(`未找到颜色映射预设: ${presetName}`);
  }

  const volumeColoringStore = useVolumeColoringStore();
  const { imageID, imageRange } = getPrimaryImageContext();
  const targetRange = mappingRange || imageRange;
  const viewIDs = getImageViewIDs();

  viewIDs.forEach((viewID) => {
    volumeColoringStore.setColorPreset(viewID, imageID, presetName);
    volumeColoringStore.updateColorTransferFunction(viewID, imageID, {
      mappingRange: targetRange,
    });
  });

  syncWindowingRange(viewIDs, imageID, targetRange);

  return {
    imageID,
    presetName,
    mappingRange: targetRange,
  };
}

export function applyCustomVolumeColormap(
  options: ApplyCustomVolumeColormapOptions
) {
  const { presetName, mappingRange } = registerCustomVolumeColormap(options);
  const volumeColoringStore = useVolumeColoringStore();
  const { imageID, imageRange } = getPrimaryImageContext();
  const targetRange = mappingRange || options.mappingRange || imageRange;
  const viewIDs = getImageViewIDs();

  viewIDs.forEach((viewID) => {
    ensureVolumeColoringConfig(viewID, imageID);
    volumeColoringStore.updateColorTransferFunction(viewID, imageID, {
      preset: presetName,
      mappingRange: targetRange,
    });
  });

  syncWindowingRange(viewIDs, imageID, targetRange);

  return {
    imageID,
    presetName,
    mappingRange: targetRange,
  };
}

export function getAvailableVolumeColormapPresets() {
  const builtInPresetNames = vtkColorMaps.rgbPresetNames || [];
  return Array.from(new Set([...MessagePresetNameList, ...builtInPresetNames]));
}

import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { useDatasetStore } from '@/src/store/datasets';
import { useViewStore } from '@/src/store/views';
import { useLayersStore } from '@/src/store/datasets-layers';
import useLayerColoringStore from '@/src/store/view-configs/layers';
import { nextTick } from 'vue';
import { MessagePresetNameList } from '@/src/vtk/ColorMaps';

export interface LayerColorPoint {
  x: number;
  rgb: [number, number, number];
}

export interface ApplyLayerCustomColormapOptions {
  name?: string;
  colorPoints: LayerColorPoint[];
  positionsNormalized?: boolean;
  mappingRange?: [number, number];
}

export interface LayerColormapPresetOption {
  value: string;
  label: string;
  actualPresetName: string;
  palette: string;
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

function inferInputRange(colorPoints: LayerColorPoint[]) {
  const xs = colorPoints.map((point) => point.x);
  return [Math.min(...xs), Math.max(...xs)] as [number, number];
}

function buildRgbPoints(
  colorPoints: LayerColorPoint[],
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

function getCurrentLayerIDs() {
  const datasetStore = useDatasetStore();
  const layersStore = useLayersStore();
  return layersStore.getLayers(datasetStore.primaryImageID).map((layer) => layer.id);
}

function getLayerViewIDs() {
  const viewStore = useViewStore();
  return Object.entries(viewStore.viewSpecs)
    .filter(([, spec]) => !spec.viewType.includes('3D'))
    .map(([viewID]) => viewID);
}

function getLayerRange(layerID: string) {
  const image = useLayersStore().layerImages[layerID];
  if (!image) {
    throw new Error('当前还没有可操作的叠加层');
  }
  return image.getPointData().getScalars().getRange() as [number, number];
}

function ensurePresetExists(presetName: string) {
  if (!vtkColorMaps.getPresetByName(presetName)) {
    throw new Error(`未找到颜色映射预设: ${presetName}`);
  }
}

function normalizeLayerPresetName(presetName: string) {
  const aliasMap: Record<string, string> = {
    Labels: 'erdc_rainbow_bright',
    FullRainbow: 'PET-rainbow',
    rainbow: 'PET-rainbow',
    ReverseRainbow: 'PET-rainbow2',
    iron: 'Black-Body Radiation',
    fmri: 'erdc_rainbow_bright',
    fmripa: 'erdc_rainbow_bright',
    random: 'erdc_rainbow_bright',
  };

  return aliasMap[presetName] || presetName;
}

function rgbToCss(value: number) {
  return Math.round(Math.max(0, Math.min(1, value)) * 255);
}

function buildPaletteFromPreset(presetName: string) {
  const preset = vtkColorMaps.getPresetByName(presetName);
  const rgbPoints = preset?.RGBPoints as number[] | undefined;
  if (!rgbPoints || rgbPoints.length < 4) {
    return 'linear-gradient(90deg, #222 0%, #999 100%)';
  }

  const scalars: number[] = [];
  for (let index = 0; index < rgbPoints.length; index += 4) {
    scalars.push(rgbPoints[index]);
  }

  const minScalar = Math.min(...scalars);
  const maxScalar = Math.max(...scalars);
  const width = maxScalar - minScalar || 1;

  const stops = [] as string[];
  for (let index = 0; index < rgbPoints.length; index += 4) {
    const scalar = rgbPoints[index];
    const red = rgbPoints[index + 1];
    const green = rgbPoints[index + 2];
    const blue = rgbPoints[index + 3];
    const percent = ((scalar - minScalar) / width) * 100;
    stops.push(
      `rgb(${rgbToCss(red)}, ${rgbToCss(green)}, ${rgbToCss(blue)}) ${percent.toFixed(1)}%`
    );
  }

  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

function registerCustomLayerPreset({
  name = 'VolView-Layer-Custom',
  colorPoints,
  positionsNormalized = true,
  mappingRange,
}: ApplyLayerCustomColormapOptions) {
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

export function getAvailableLayerColormapPresets() {
  const builtInPresetNames = vtkColorMaps.rgbPresetNames || [];
  const slicerPresetNames = [
    'Labels',
    'FullRainbow',
    'gray',
    'iron',
    'rainbow',
    'ocean',
    'desert',
    'InvertedGrey',
    'ReverseRainbow',
    'fmri',
    'fmripa',
    'random',
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'PET-heat',
    'PET-rainbow',
    'PET-rainbow2',
    'PET-dicom',
    'PET-hotmetablue',
  ];

  return Array.from(
    new Set([...slicerPresetNames, ...MessagePresetNameList, ...builtInPresetNames])
  );
}

export function getLayerColormapPresetOptions(): LayerColormapPresetOption[] {
  return getAvailableLayerColormapPresets().map((presetName) => {
    const actualPresetName = normalizeLayerPresetName(presetName);
    return {
      value: presetName,
      label: presetName,
      actualPresetName,
      palette: buildPaletteFromPreset(actualPresetName),
    };
  });
}

export function applyLayerColormapPreset(
  presetName: string,
  mappingRange?: [number, number]
) {
  const normalizedPresetName = normalizeLayerPresetName(presetName);
  ensurePresetExists(normalizedPresetName);

  const layerColoringStore = useLayerColoringStore();
  const layerIDs = getCurrentLayerIDs();
  const viewIDs = getLayerViewIDs();

  layerColoringStore.setRuntimeDefaults({
    preset: normalizedPresetName,
    mappingRange: mappingRange || null,
  });

  layerIDs.forEach((layerID) => {
    const targetRange = mappingRange || getLayerRange(layerID);
    viewIDs.forEach((viewID) => {
      layerColoringStore.setColorPreset(
        viewID,
        layerID,
        normalizedPresetName,
        targetRange
      );
    });
  });

  // 强制下一轮渲染立即吃到新的色图，避免必须再调一次透明度才更新。
  void nextTick();

  return {
    presetName: normalizedPresetName,
    requestedPresetName: presetName,
    mappingRange: mappingRange || null,
    layerCount: layerIDs.length,
  };
}

export function applyLayerCustomColormap(
  options: ApplyLayerCustomColormapOptions
) {
  const { presetName, mappingRange } = registerCustomLayerPreset(options);
  return applyLayerColormapPreset(presetName, mappingRange || options.mappingRange);
}

export function applyLayerOpacity(opacityPercent: number) {
  if (!Number.isFinite(opacityPercent)) {
    throw new Error('透明度必须是数字');
  }

  const normalizedOpacity = opacityPercent <= 1
    ? Math.max(0, Math.min(1, opacityPercent))
    : Math.max(0, Math.min(1, opacityPercent / 100));
  const layerColoringStore = useLayerColoringStore();
  const layerIDs = getCurrentLayerIDs();
  const viewIDs = getLayerViewIDs();

  layerColoringStore.setRuntimeDefaults({ opacity: normalizedOpacity });

  layerIDs.forEach((layerID) => {
    viewIDs.forEach((viewID) => {
      layerColoringStore.updateBlendConfig(viewID, layerID, {
        opacity: normalizedOpacity,
        visibility: normalizedOpacity > 0,
      });
    });
  });

  return {
    opacity: normalizedOpacity,
    opacityPercent: Math.round(normalizedOpacity * 100),
    layerCount: layerIDs.length,
  };
}

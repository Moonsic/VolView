import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import MedicalPresets from '@/src/vtk/MedicalColorPresets.json';

function registerPresets(presets: typeof MedicalPresets) {
  for (let i = 0; i < presets.length; i += 1) {
    vtkColorMaps.addPreset(presets[i]);
  }
}

registerPresets(MedicalPresets);

const MessageColorPresets = [
  {
    Name: 'VolView-Grayscale',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 1, 1, 1],
  },
  {
    Name: 'VolView-BlueRed',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.05, 0.1, 0.35,
      0.35, 0.1, 0.45, 0.95,
      0.65, 0.95, 0.95, 0.95,
      1, 0.82, 0.12, 0.12,
    ],
  },
  {
    Name: 'VolView-Viridis',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.267, 0.004, 0.329,
      0.25, 0.283, 0.141, 0.458,
      0.5, 0.254, 0.265, 0.53,
      0.75, 0.207, 0.372, 0.553,
      1, 0.993, 0.906, 0.144,
    ],
  },
  {
    Name: 'VolView-Plasma',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.05, 0.03, 0.528,
      0.25, 0.489, 0.01, 0.659,
      0.5, 0.798, 0.28, 0.47,
      0.75, 0.973, 0.586, 0.252,
      1, 0.94, 0.975, 0.131,
    ],
  },
  {
    Name: 'VolView-GreenFire',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0, 0, 0,
      0.3, 0.0, 0.35, 0.15,
      0.6, 0.2, 0.8, 0.3,
      0.82, 0.95, 0.9, 0.2,
      1, 1, 0.35, 0.05,
    ],
  },
  {
    Name: 'gray',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 1, 1, 1],
  },
  {
    Name: 'InvertedGrey',
    ColorSpace: 'RGB',
    RGBPoints: [0, 1, 1, 1, 1, 0, 0, 0],
  },
  {
    Name: 'red',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 1, 0, 0],
  },
  {
    Name: 'green',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 0, 1, 0],
  },
  {
    Name: 'blue',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 0, 0, 1],
  },
  {
    Name: 'yellow',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 1, 1, 0],
  },
  {
    Name: 'cyan',
    ColorSpace: 'RGB',
    RGBPoints: [0, 0, 0, 0, 1, 0, 1, 1],
  },
  {
    Name: 'ocean',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.0, 0.03, 0.15,
      0.4, 0.0, 0.3, 0.7,
      0.75, 0.2, 0.75, 0.95,
      1, 0.85, 1, 1,
    ],
  },
  {
    Name: 'desert',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.12, 0.07, 0.02,
      0.35, 0.55, 0.32, 0.08,
      0.7, 0.86, 0.67, 0.32,
      1, 1, 0.95, 0.7,
    ],
  },
  {
    Name: 'PET-heat',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0, 0, 0,
      0.3, 0.45, 0, 0,
      0.6, 0.95, 0.45, 0,
      1, 1, 1, 0.85,
    ],
  },
  {
    Name: 'PET-hotmetablue',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0, 0, 0.25,
      0.35, 0, 0.45, 1,
      0.65, 1, 0.45, 0,
      1, 1, 1, 0.8,
    ],
  },
  {
    Name: 'PET-rainbow',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0, 0, 1,
      0.25, 0, 1, 1,
      0.5, 0, 1, 0,
      0.75, 1, 1, 0,
      1, 1, 0, 0,
    ],
  },
  {
    Name: 'PET-rainbow2',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0.15, 0, 0.4,
      0.25, 0, 0.35, 1,
      0.5, 0, 1, 0.8,
      0.75, 1, 0.95, 0,
      1, 1, 0.2, 0,
    ],
  },
  {
    Name: 'PET-dicom',
    ColorSpace: 'RGB',
    RGBPoints: [
      0, 0, 0, 0,
      0.2, 0.0, 0.0, 0.5,
      0.5, 0.6, 0.0, 0.8,
      0.8, 1.0, 0.5, 0.0,
      1, 1.0, 1.0, 1.0,
    ],
  },
];

registerPresets(MessageColorPresets as typeof MedicalPresets);
export const MessagePresetNameList = MessageColorPresets.map(
  (preset) => preset.Name
);

const twoHotOpaque = {
  ...vtkColorMaps.getPresetByName('2hot'),
  Name: '2hot-opaque',
  OpacityPoints: [0, 1],
};
vtkColorMaps.addPreset(twoHotOpaque);

/* prettier-ignore */
const GroupedPresets = [
  {
    group: 'CT',
    presets: [
      'CT-AAA',
      'CT-AAA2',
      'CT-Bone',
      'CT-Bones',
      'CT-Cardiac',
      'CT-Cardiac2',
      'CT-Cardiac3',
      'CT-Chest-Contrast-Enhanced',
      'CT-Chest-Vessels',
      'CT-Coronary-Arteries',
      'CT-Coronary-Arteries-2',
      'CT-Coronary-Arteries-3',
      'CT-Cropped-Volume-Bone',
      'CT-Fat',
      'CT-Liver-Vasculature',
      'CT-Lung',
      'CT-MIP',
      'CT-Muscle',
      'CT-Pulmonary-Arteries',
      'CT-Soft-Tissue',
      'CT-Air',
      'CT-X-ray',
    ],
  },
  {
    group: 'MR',
    presets: [
      'MR-Default',
      'MR-Angio',
      'MR-MIP',
      'MR-T2-Brain',
    ],
  },
  {
    group: 'DTI',
    presets: [
      'DTI-FA-Brain',
    ],
  },
  {
    group: 'US',
    presets: [
      'US-Fetal',
    ],
  },
];

export const PresetNameList = GroupedPresets.flatMap((group) => group.presets);
export default GroupedPresets;

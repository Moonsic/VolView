import { MaybeRef } from 'vue';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import { useVtkRepresentation } from '@/src/core/vtk/useVtkRepresentation';
import { Maybe } from '@/src/types';
import { View } from '@/src/core/vtk/types';
import vtkImageResliceMapper from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper';
import { onVTKEvent } from '@/src/composables/onVTKEvent';
import { vtkFieldRef } from '@/src/core/vtk/vtkFieldRef';

let pendingPlaneRender = false;

export function useResliceRepresentation(
  view: View,
  imageData: MaybeRef<Maybe<vtkImageData>>
) {
  const sliceRep = useVtkRepresentation({
    view,
    data: imageData,
    vtkActorClass: vtkImageSlice,
    vtkMapperClass: vtkImageResliceMapper,
  });

  const plane = vtkFieldRef(sliceRep.mapper, 'slicePlane');
  onVTKEvent(plane, 'onModified', () => {
    // Oblique 交互时 plane.normal 和 plane.origin 会连续改动。
    // 这里如果每次改一个字段就立即渲染，容易在中间态出现裂缝、三角缺口和闪烁。
    if (pendingPlaneRender) return;
    pendingPlaneRender = true;
    requestAnimationFrame(() => {
      pendingPlaneRender = false;
      view.requestRender();
    });
  });

  return sliceRep;
}

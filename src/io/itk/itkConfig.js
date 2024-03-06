import { join } from '@/src/utils/path';

const base = import.meta.env.BASE_URL;

const fullUrl = (relative) =>
  new URL(join(base, relative), document.location.origin).href;

// GGG 路径改成/static/volview-dist/itk/才能被A项目访问到

const itkConfig = {
  pipelineWorkerUrl: fullUrl('/static/volview-dist/itk/itk-wasm-pipeline.min.worker.js'),
  imageIOUrl: fullUrl('/static/volview-dist/itk/image-io'),
  meshIOUrl: fullUrl('/static/volview-dist/itk/mesh-io'),
  pipelinesUrl: fullUrl('/static/volview-dist/itk/pipelines'),
};

export default itkConfig;

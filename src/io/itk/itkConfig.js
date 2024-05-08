import { join } from '@/src/utils/path';

const base = import.meta.env.BASE_URL;

const fullUrl = (relative) =>
  new URL(join(base, relative), document.location.origin).href;

// GGG 生产环境路径改成/static/volview-dist/itk/xxx 才能被A项目访问到

const isProd = process.env.NODE_ENV === 'production'; // 是否为生产环境

const path = isProd ? '/static/volview-dist' : ''

const itkConfig = {
  pipelineWorkerUrl: fullUrl(`${path}/itk/itk-wasm-pipeline.min.worker.js`),
  imageIOUrl: fullUrl(`${path}/itk/image-io`),
  meshIOUrl: fullUrl(`${path}/itk/mesh-io`),
  pipelinesUrl: fullUrl(`${path}/itk/pipelines`),
};

export default itkConfig;

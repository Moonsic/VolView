const fullUrl = (relative) => {
  // ex: /itk/image-io
  const u = new URL(document.location); // ex: http://localhost:8043/orthanc/volview/index.html
  const origin = u.origin; // ex: http://localhost:8043
  const pathParts = u.pathname.split('/'); // ex: ['', 'orthanc', 'volview', 'index.html']
  pathParts.pop(); // ex: ['', 'orthanc', 'volview']

  const url = origin + pathParts.join('/') + relative; // ex http://localhost:8043/orthanc/volview/itk/image-io
  return url;
};

// GGG 生产环境路径改成/static/volview-dist/itk/xxx 才能被A项目访问到

// const isProd = process.env.NODE_ENV === 'production'; // 是否为生产环境
// const path = isProd ? '/static/volview-dist' : '' // 旧版本是这样写。生产环境要区分

const path =  '' // 新版本不区分isProd了

const itkConfig = {
  pipelineWorkerUrl: fullUrl(`${path}/itk/itk-wasm-pipeline.min.worker.js`),
  imageIOUrl: fullUrl(`${path}/itk/image-io`),
  meshIOUrl: fullUrl(`${path}/itk/mesh-io`),
  pipelinesUrl: fullUrl(`${path}/itk/pipelines`),
};

export default itkConfig;

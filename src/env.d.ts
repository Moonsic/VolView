/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DICOM_WEB_URL: string;
  readonly VITE_DICOM_WEB_NAME: string;
  readonly VITE_ENABLE_REMOTE_SAVE: boolean;
  readonly VITE_REMOTE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


interface Window {
  xyzCenter: Vector3
  dimensions: vec3
  distanceList: number[]
  xyzMinList: number[]
  worldToIndex: mat4
  nearValue: number
  spacing: vec3
  pageType: string // gzc或者空
}

declare const __VERSIONS__: Record<string, string>;

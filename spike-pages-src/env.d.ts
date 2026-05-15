/// <reference types="vite/client" />
/// <reference path="../typings/index.d.ts" />

declare module '@/*' // declare module 'xxx'路径或者模块名
declare module '@a/*' // declare module 'xxx'路径或者模块名
declare module '@c/*' // declare module 'xxx'路径或者模块名
declare module '@u/*' // declare module 'xxx'路径或者模块名
declare module '@v/*' // declare module 'xxx'路径或者模块名
declare module '*/config.ts' // declare module 'xxx'路径或者模块名
declare module '*/Index.jsx' // declare module 'xxx'路径或者模块名

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

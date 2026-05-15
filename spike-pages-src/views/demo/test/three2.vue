<template>
  <div class="page">
    <div ref="canvasContainer" style="width: 100%; height: 100%; cursor: move;"></div>
  </div>

</template>

<script lang="ts" setup>
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { html } from './html.js'
import { html2 } from './html2.js'
// import { helmet_color } from './color2.js'

// 头盔数据
// const helmet_vertices = html.helmet_vertices
// const helmet_faces = html.helmet_faces
// const helmet_scalars = html.helmet_scalars

const helmet_vertices = html2.head_vertices
const helmet_faces = html2.head_faces

// 等高线数据
const contour_vertices = html.contour_vertices
const contour_faces = html.contour_faces
const contour_scalars = html.contour_scalars

// console.log('helmet_vertices :>> ', helmet_vertices.length);
// console.log('helmet_faces :>> ', helmet_faces.length);
// console.log('helmet_scalars :>> ', helmet_scalars.length);

// console.log('contour_vertices :>> ', contour_vertices.length);
// console.log('contour_faces :>> ', contour_faces.length);
// console.log('contour_scalars :>> ', contour_scalars.length);

const canvasContainer = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;


const width = window.innerWidth * 1;
const height = window.innerHeight * 1;


onMounted(() => {
  init();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  renderer.dispose();
  canvasContainer.value.removeChild(renderer.domElement);
  scene = null;
  camera = null;
  renderer = null;
});

const init = () => {

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f3f5);

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // 设置相机位置
  camera.position.z = 300;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // 初始化渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 添加到 DOM
  canvasContainer.value?.appendChild(renderer.domElement);

  // 设置背景色为白色
  renderer.setClearColor(0xf1f3f5, 1); // 第一个参数是颜色（十六进制），第二个参数是透明度（范围从0到1）


  // 创建几何体、材质、网格等...
  // 添加光照、环境、背景等...

  // createCube()   // 正方形
  // createPlane() // 一个面
  // createLine()  // 线段
  // createText()  // 文字

  createHelmet() // 创建头盔
  // createContourGeometry() // 创建等高线数据


  // 添加光照，否则透明物体可能看不见
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // 环境光
  scene.add(ambientLight);

  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // 白色点光源，强度为1，衰减范围为100单位
  pointLight.position.set(0, 0, 20); // 将光源置于（0, 0, 20）位置，即在相机前方20个单位处
  scene.add(pointLight); // 将光源添加到场景中


  // const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
  // dirLight.position.set( 0, 0, 1 ).normalize();
  // scene.add( dirLight );

  // const pointLight = new THREE.PointLight( 0xffffff, 4.5, 0, 0 );
  // pointLight.color.setHSL( Math.random(), 1, 0.5 );
  // pointLight.position.set( 0, 100, 90 );
  // scene.add( pointLight );



  // 设置相机位置
  // camera.position.set(100, 0, 100); // zhg
  camera.lookAt(0, 0, 0);
  // camera.lookAt(scene.position);



  // 使用 OrbitControls 实现拖动旋转
  controls = new OrbitControls(camera, canvasContainer.value);
  controls.enableDamping = true; // 启用阻尼效果
  controls.dampingFactor = 0.1; // 设置阻尼系数，越小越平滑
  controls.screenSpacePanning = false; // 禁止屏幕空间平移
  controls.minDistance = 2; // 最小缩放距离
  controls.maxDistance = 1000; // 最大缩放距离



  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update(); // 更新 OrbitControls
    renderer.render(scene, camera);
  };
  animate();

}


function flattenArray(arr: any[]): number[] {
  return arr.reduce((accumulator: number[], currentValue: any) => {
    return accumulator.concat(Array.isArray(currentValue) ? flattenArray(currentValue) : currentValue);
  }, []);
}

// 头盔
function createHelmet() {

  // 将颜色数组转换为 Float32Array 类型，因为 BufferAttribute 需要这种格式
  // const vertexColors = new Float32Array(helmet_color.flatMap(color => color))

  const newRr = flattenArray(helmet_vertices)
  newRr.forEach((item: number, index: number) => {
    newRr[index] = Number((item).toFixed(2))
  })
  const indices = flattenArray(helmet_faces)
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(newRr);
  geometry.setIndex(indices);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 为几何体设置顶点位置信息，itemSize = 3 因为每个顶点都是一个三元组。
  // geometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3)); // 颜色不带透明度为3： R, G, B 三个分量；颜色带透明度为4： R, G, B A 四个分量

  // // 底色
  // const materialBg = new THREE.MeshBasicMaterial({
  //   color: 0xc1c3c5,
  //   opacity: 1,
  //   depthWrite: true,       // 深度写入
  //   transparent: false,     // 启用透明度
  //   side: THREE.DoubleSide, // 设置双面渲染
  // });
  // const meshBg = new THREE.Mesh(geometry, materialBg);
  // scene.add(meshBg);


  const material = new THREE.MeshBasicMaterial({
    opacity: 0.5,
    depthWrite: true,       // 深度写入
    transparent: true,      // 启用透明度
    // vertexColors: true,     // 开启顶点颜色
    side: THREE.DoubleSide, // 设置双面渲染
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  // // 头盔三角形的线，不展示
  // const materialLine = new THREE.LineBasicMaterial({
  //   color: 0x00ff00,
  // });
  // const line = new THREE.LineSegments(geometry, materialLine);
  // scene.add(line);

}

// 创建等高线数据
function createContourGeometry() {

  const geometry = new THREE.BufferGeometry;

  const newRr = flattenArray(contour_vertices)
  newRr.forEach((item: number, index: number) => {
    newRr[index] = Number((item).toFixed(2))
  })

  const indices = flattenArray(contour_faces)
  const vertices = new Float32Array(newRr);

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


  // 创建一个材质，用于绘制等高线
  const materialLine = new THREE.LineBasicMaterial({
    color: 0xeeeeee,
  });
  const line = new THREE.LineSegments(geometry, materialLine);
  scene.add(line);

}

// 创建立方体
function createCube() {
  // 定义六种不同的颜色，每个颜色包含透明度（alpha）
  const colors = [
    new THREE.Color(0xff0000), // 红色
    new THREE.Color(0x00ff00), // 绿色
    new THREE.Color(0x0000ff), // 蓝色
    new THREE.Color(0xffff00), // 黄色
    new THREE.Color(0xff00ff), // 紫色
    new THREE.Color(0x00ffff), // 青色
  ];
  // console.log('colors :>> ', colors);
  // 创建几何体
  const geometry = new THREE.BoxGeometry(5, 8, 10); // x宽,y高,z深
  // 创建材质（只有绿色）
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.3,
    transparent: true, // 启用透明度
    side: THREE.DoubleSide, // 设置双面渲染
  });
  const cube = new THREE.Mesh(geometry, material);

  // // 创建多材质
  // const materials = [];
  // for (let i = 0; i < 6; i++) {
  //   const material = new THREE.MeshNormalMaterial({
  //   // const material = new THREE.MeshBasicMaterial({
  //     color: colors[i],
  //     transparent: true,
  //     opacity: 0.5, // 接使用 colors[i].a 获取 alpha 值作为材质的不透明度
  //     // opacity: colors[i].a, // 接使用 colors[i].a 获取 alpha 值作为材质的不透明度
  //   });
  //   materials.push(material);
  // }
  // // 创建立方体网格模型，使用多材质
  // const cube = new THREE.Mesh(geometry, materials);

  scene.add(cube);
}

// 创建面
function createPlane() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -1.0, -1.0, 1.0, // v0
    1.0, -1.0, 1.0, // v1
    1.0, 1.0, 1.0, // v2
    -1.0, 1.0, 1.0, // v3
  ]);
  const indices = [
    0, 1, 2,
    2, 3, 0,
  ];
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

// 创建线
function createLine() {
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

// 创建文字
function createText() {
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}


const onWindowResize = () => {
  if (renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};



</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
}
</style>